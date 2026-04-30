<script setup lang="ts">
import type { PayPalButtonsComponentOptions } from '@paypal/paypal-js'
import { usePaypal } from '../composables/usePaypal'
import { useTemplateRef, watchEffect } from 'vue'

const props = defineProps<PayPalButtonsComponentOptions & { namespace?: string }>()

const { isReady, renderButton } = usePaypal({ namespace: props.namespace })
const buttonEl = useTemplateRef<HTMLDivElement>('button-el')

watchEffect(() => {
  if (isReady.value && buttonEl.value)
    renderButton(buttonEl.value, props)
})
</script>

<template>
  <ClientOnly>
    <div ref="button-el" />
  </ClientOnly>
</template>
