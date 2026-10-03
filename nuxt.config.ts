// https://nuxt.com/docs/api/configuration/nuxt-config

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
