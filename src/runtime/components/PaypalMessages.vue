<script setup lang="ts">
import type { PayPalMessagesComponentOptions } from '@paypal/paypal-js'
import { usePaypal } from '../composables/usePaypal'
import { useTemplateRef, watchEffect } from 'vue'

const props = defineProps<PayPalMessagesComponentOptions & { namespace?: string }>()

const { isReady, renderMessage } = usePaypal({ namespace: props.namespace })
const messageEl = useTemplateRef<HTMLDivElement>('message-el')

watchEffect(() => {
  if (isReady.value && messageEl.value)
    renderMessage(messageEl.value, props)
})
</script>

<template>
  <ClientOnly>
    <div ref="message-el" />
  </ClientOnly>
</template>
