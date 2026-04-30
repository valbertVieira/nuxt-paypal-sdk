export default defineNuxtConfig({
  modules: ['nuxt-paypal-sdk'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  paypal: {
    components: ['buttons', 'marks', 'messages'],
    clientId: 'REDACTED',
  },
})
