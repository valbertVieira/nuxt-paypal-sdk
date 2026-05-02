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
    name: 'nuxt-paypal-sdk',
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
    addComponent({
      name: 'PaypalCardFields',
      filePath: resolver.resolve('./runtime/components/PaypalCardFields.vue'),
    })
    addComponent({
      name: 'PaypalCardNumber',
      filePath: resolver.resolve('./runtime/components/PaypalCardNumber.vue'),
    })
    addComponent({
      name: 'PaypalCardExpiry',
      filePath: resolver.resolve('./runtime/components/PaypalCardExpiry.vue'),
    })
    addComponent({
      name: 'PaypalCardCvv',
      filePath: resolver.resolve('./runtime/components/PaypalCardCvv.vue'),
    })
    addComponent({
      name: 'PaypalCardName',
      filePath: resolver.resolve('./runtime/components/PaypalCardName.vue'),
    })
  },
})
