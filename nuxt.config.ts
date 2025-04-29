// https://nuxt.com/docs/api/configuration/nuxt-config

const CACHE_VARIES = ['host', 'accept-encoding', 'user-agent', 'sec-ch-viewport-height', 'sec-ch-viewport-width'];

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
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
        '@/plugins/ssr-debug',
    ],
    routeRules: {
        '/': {redirect: {to: '/latest', statusCode: 301}},

        '/**': {
            isr: 60 * 60,
            cache: {
                maxAge: 60 * 60 * 24,
                varies: CACHE_VARIES
            }
        }
    },
    vuetify: {
        moduleOptions: {
            ssrClientHints: {
                reloadOnFirstRequest: false,
                viewportSize: true
            }
        },
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
