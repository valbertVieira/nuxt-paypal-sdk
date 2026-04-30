export default defineNuxtConfig({
  modules: ['paypal-nuxt'],
  devtools: { enabled: true },
  compatibilityDate: 'latest',
  paypal: {
    components: ['buttons', 'marks', 'messages'],
    clientId: 'REDACTED',
  },
})
