import { defineNuxtModule, addPlugin, addImportsDir, addComponent, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import type { PayPalScriptOptions } from '@paypal/paypal-js'

export type ModuleOptions = PayPalScriptOptions

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    paypal: PayPalScriptOptions
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'paypal-nuxt',
    configKey: 'paypal',
  },
  defaults: {
    clientId: '',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.paypal = defu(
      nuxt.options.runtimeConfig.public.paypal,
      options,
    )

    addPlugin(resolver.resolve('./runtime/plugin'))
    addImportsDir(resolver.resolve('./runtime/composables'))
    addComponent({
      name: 'PaypalButton',
      filePath: resolver.resolve('./runtime/components/PaypalButton.vue'),
    })
    addComponent({
      name: 'PaypalMarks',
      filePath: resolver.resolve('./runtime/components/PaypalMarks.vue'),
    })
    addComponent({
      name: 'PaypalMessages',
      filePath: resolver.resolve('./runtime/components/PaypalMessages.vue'),
    })
  },
})
