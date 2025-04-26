export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:rendered', (ctx) => {
    console.log('Rendered payload:', ctx.ssrContext.payload);
  });
});