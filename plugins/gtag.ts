import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            gtag: (...args: any[]) => {
                try {
                    (window as any).gtag(...args);
                } catch (e) {
                    console.debug(e)
                }
            }
        }
    }
})
