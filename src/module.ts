import { defineNuxtModule, addPlugin, addImportsDir, addComponent, createResolver } from '@nuxt/kit'
import { defu } from 'defu'
import type { PayPalScriptOptions } from '@paypal/paypal-js'

export interface ModuleOptions extends PayPalScriptOptions {
  clientSecret?: string
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    paypal: PayPalScriptOptions
  }
  interface RuntimeConfig {
    paypal: {
      clientSecret: string
    }
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

    const { clientSecret, ...scriptOptions } = options

    nuxt.options.runtimeConfig.public.paypal = defu(
      nuxt.options.runtimeConfig.public.paypal,
      scriptOptions,
    )

    nuxt.options.runtimeConfig.paypal = defu(
      nuxt.options.runtimeConfig.paypal,
      { clientSecret: clientSecret ?? '' },
    )

    addPlugin(resolver.resolve('./runtime/plugin'))
    addImportsDir(resolver.resolve('./runtime/composables'))
    addComponent({
      name: 'PaypalButton',
      filePath: resolver.resolve('./runtime/components/PaypalButton.vue'),
    })
  },
})
