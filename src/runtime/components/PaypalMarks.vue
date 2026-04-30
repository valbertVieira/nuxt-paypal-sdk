<script setup lang="ts">
import type { PayPalMarksComponentOptions } from '@paypal/paypal-js'
import { usePaypal } from '../composables/usePaypal'
import { useTemplateRef, watchEffect } from 'vue'

const props = defineProps<PayPalMarksComponentOptions & { namespace?: string }>()

const { isReady, renderMark } = usePaypal({ namespace: props.namespace })
const markEl = useTemplateRef<HTMLDivElement>('mark-el')

watchEffect(() => {
  if (isReady.value && markEl.value)
    renderMark(markEl.value, props)
})
</script>

<template>
  <ClientOnly>
    <div ref="mark-el" />
  </ClientOnly>
</template>
