import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import {defineNuxtPlugin} from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  const authStore = useAuthStore();
  const {ghToken} = storeToRefs(authStore);

  const githubApi = $fetch.create({
    baseURL: 'https://api.github.com',
    onRequest({ request, options, error }) {
      if (ghToken.value) {
        options.headers.set('Authorization', `Bearer ${ghToken.value}`)
      }
    }
  })

  return {
    provide: {
      githubApi
    }
  }
})