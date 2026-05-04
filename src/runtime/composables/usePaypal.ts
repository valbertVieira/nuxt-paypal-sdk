import type { FUNDING_SOURCE, PayPalButtonsComponentOptions, PayPalCardFieldsComponentOptions, PayPalMarksComponentOptions, PayPalMessagesComponentOptions, PayPalNamespace, PayPalScriptOptions } from '@paypal/paypal-js'
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
        await button.render(target)
      }
    }
    catch (error) {
      console.error('failed to render the PayPal Buttons', error)
    }
  }

  async function renderMark(target: string | HTMLElement, markOptions?: PayPalMarksComponentOptions) {
    if (!paypal.value || !paypal.value.Marks) {
      return
    }

    try {
      const mark = paypal.value.Marks({ ...(markOptions ?? {}) })

      if (mark.isEligible()) {
        await mark.render(target)
      }
    }
    catch (error) {
      console.error('failed to render the PayPal Marks', error)
    }
  }

  async function renderMessage(target: string | HTMLElement, messageOptions?: PayPalMessagesComponentOptions) {
    if (!paypal.value || !paypal.value.Messages) {
      return
    }

    try {
      const message = paypal.value.Messages({ ...(messageOptions ?? {}) })
      await message.render(target)
    }
    catch (error) {
      console.error('failed to render the PayPal Messages', error)
    }
  }

  function createCardFields(cardFieldsOptions: PayPalCardFieldsComponentOptions) {
    if (!paypal.value || !paypal.value.CardFields) {
      return null
    }

    try {
      const cardFields = paypal.value.CardFields({ ...cardFieldsOptions })
      if (!cardFields.isEligible()) return null
      return cardFields
    }
    catch (error) {
      console.error('failed to create the PayPal CardFields', error)
      return null
    }
  }

  function getFundingSources(): FUNDING_SOURCE[] {
    return paypal.value?.getFundingSources?.() ?? []
  }

  function isFundingEligible(source: FUNDING_SOURCE): boolean {
    return paypal.value?.isFundingEligible?.(source) ?? false
  }

  if (import.meta.client && (hasOverrides || !loadAttempted.value)) {
    loadSdk()
  }

  return { renderButton, renderMark, renderMessage, createCardFields, getFundingSources, isFundingEligible, isReady }
}
