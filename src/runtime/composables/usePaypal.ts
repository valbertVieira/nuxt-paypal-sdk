import type { PayPalButtonsComponentOptions, PayPalNamespace, PayPalScriptOptions } from '@paypal/paypal-js'
import { loadScript } from '@paypal/paypal-js'
import { computed, useRuntimeConfig, useState } from '#imports'

export interface UsePaypalOptions extends Partial<PayPalScriptOptions> {
  namespace?: string
}

export function usePaypal(options: UsePaypalOptions = {}) {
  const { namespace = 'paypal', ...overrides } = options
  const hasOverrides = Object.keys(overrides).length > 0
  const { public: { paypal: scriptOptions } } = useRuntimeConfig()
  const merged = { ...scriptOptions, ...overrides, dataNamespace: namespace }

  const paypal = useState<PayPalNamespace | null>(`paypal:sdk:${namespace}`, () => null)
  const loadedKey = useState<string | null>(`paypal:loaded-key:${namespace}`, () => null)
  const loadAttempted = useState<boolean>(`paypal:attempted:${namespace}`, () => false)
  const isReady = computed(() => paypal.value !== null)

  async function loadSdk() {
    const key = JSON.stringify(merged)
    if (paypal.value && loadedKey.value === key)
      return paypal.value

    loadAttempted.value = true
    try {
      paypal.value = await loadScript(merged)
      loadedKey.value = key
      return paypal.value
    }
    catch (error) {
      console.error('failed to load the PayPal JS SDK script', error)
      return null
    }
  }

  async function renderButton(target: string | HTMLElement, buttonOptions?: PayPalButtonsComponentOptions) {
    if (!paypal.value || !paypal.value.Buttons) {
      return
    }

    try {
      const button = paypal.value.Buttons({ ...(buttonOptions ?? {}) })

      if (button.isEligible()) {
        button.render(target)
      }
    }
    catch (error) {
      console.error('failed to render the PayPal Buttons', error)
    }
  }

  if (import.meta.client && (hasOverrides || !loadAttempted.value)) {
    console.log('loading PayPal JS SDK with options:', merged)
    loadSdk()
  }

  return { renderButton, isReady }
}
