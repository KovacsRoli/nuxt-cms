// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    mongodbUri: 'connection string',
    saltRounds: 10,
    jwtAccessSecret: 'secret',
    jwtRefreshSecret: 'secret',
    jwtAccessExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
  },
  typescript: {
    shim: false, // disable generating the shim for *.vue files
    strict: true,
  },
  modules: ['@nuxtjs/tailwindcss'],
  nitro: {
    plugins: ['~/server/index.ts'],
  },
})
