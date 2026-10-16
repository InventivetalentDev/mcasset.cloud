// https://nuxt.com/docs/api/configuration/nuxt-config

import { createRequire } from 'node:module'
import type { Plugin } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const polyfillRequire = createRequire(createRequire(import.meta.url).resolve('vite-plugin-node-polyfills'))

// protodef (used by prismarine-nbt for structure files) compiles parsers with a direct `eval` that reads the
// locals `native` and `PartialReadError`. Rollup drops those locals, so the production build fails with
// "native is not defined". Compiling through `new Function` with explicit parameters keeps them referenced.
function protodefEvalScope(): Plugin {
    const target = 'return eval(code)()'
    return {
        name: 'protodef-eval-scope',
        enforce: 'pre',
        transform(code, id) {
            if (!/[\\/]protodef[\\/]src[\\/]compiler\.js$/.test(id)) return
            if (!code.includes(target)) this.error('protodef compiler.js changed; update protodefEvalScope()')
            return code.replace(target, 'return new Function("native", "PartialReadError", "return (" + code + ")")(native, PartialReadError)()')
        }
    }
}

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {
        enabled: true
    },
    ssr: true,
    nitro: {
        debug: process.env.NODE_ENV === 'development'
    },
    experimental: {
        renderJsonPayloads: true
    },
    modules: [
        'vuetify-nuxt-module',
        '@pinia/nuxt',
        '@pinia/colada-nuxt',
        'pinia-plugin-persistedstate/nuxt',
    ],
    plugins: [
        '@/plugins/gtag',
    ],
    hooks: {
        // MineRender parses structure files with prismarine-nbt, which needs Node's Buffer and zlib in the browser.
        // Only the client build gets the polyfills, so the server bundle stays as it is.
        'vite:extendConfig'(config, { isClient }) {
            if (!isClient) return
            config.plugins ??= []
            const polyfills = nodePolyfills({
                // An injected Buffer global would put the Buffer polyfill in the entry chunk, so the 3D preview sets
                // globalThis.Buffer itself. browserify-zlib calls process.nextTick, so process stays injected.
                globals: { Buffer: false, global: false, process: true },
                // readable-stream imports process/; resolve it to a file for Vite's dependency optimizer.
                overrides: { process: polyfillRequire.resolve('process/browser.js') }
            })
            // The inject plugin also rewrites `process` in app code. In dev that runs before Nuxt's `process.client`
            // define, so `process.client` reads the shim and is undefined. Only dependencies need the shim.
            const inject = polyfills.find(plugin => plugin.name === 'vite-plugin-node-polyfills:inject')
            const transform = inject?.transform
            if (!inject || typeof transform !== 'function') throw new Error('vite-plugin-node-polyfills changed; update the inject wrapper in nuxt.config.ts')
            inject.transform = function (code, id, options) {
                return id.includes('/node_modules/') && !/\.css($|\?)/.test(id) ? transform.call(this, code, id, options) : undefined
            }
            config.plugins.push(protodefEvalScope(), ...polyfills)
        }
    },
    routeRules: {
        '/': { redirect: { to: '/latest', statusCode: 301 } },

        // Deliberately no `isr` / `cache` rule here.
        //  - Nitro's `isr` is only implemented for Vercel/Netlify; on Cloudflare it is a no-op.
        //  - Both options switch Nuxt to payload extraction, so every page view costs a second
        //    full server render to answer the client's follow-up `/_payload.json` request.
        //  - Nitro's `cache` has no durable storage on Cloudflare Pages: it falls back to the
        //    isolate's memory, keyed by user-agent/viewport, so it almost never hits and only
        //    adds serialisation work and memory pressure.
        // Rendered pages get a Cache-Control header from server/plugins/cache-headers.ts so
        // that Cloudflare's edge can cache them instead (see README).
    },
    vuetify: {
        // No `ssrClientHints`: nothing in the app reads the viewport during SSR, and the
        // Accept-CH / Critical-CH / Vary headers it adds make first-time browsers re-request
        // the page and prevent the HTML from being cached at the edge.
        vuetifyOptions: {
            theme: {
                defaultTheme: 'dark'
            }
        }

    },
    runtimeConfig: {
        public: {
            isDev: process.env.NODE_ENV === 'development',
            hosts: {},
            cfPagesCommitSha: process.env.CF_PAGES_COMMIT_SHA,
            cfPagesBranch: process.env.CF_PAGES_BRANCH,
            cfPagesUrl: process.env.CF_PAGES_URL,
            google: {
                adsense: process.env.GOOGLE_ADSENSE
            },
        }
    },
})
