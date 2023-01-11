// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    shim: false, // disable generating the shim for *.vue files
    strict: true,
  },
  modules: ['@nuxtjs/tailwindcss']
});
