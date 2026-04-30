export default defineNuxtConfig({
  modules: ['paypal-nuxt'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  paypal: {
    clientId: 'REDACTED',
  },
})
