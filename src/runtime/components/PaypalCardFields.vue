<script setup lang="ts">
import type { PayPalCardFieldsComponent, PayPalCardFieldsComponentOptions } from '@paypal/paypal-js'
import { usePaypal } from '../composables/usePaypal'
import { provide, ref, watchEffect } from 'vue'
import { paypalCardFieldsKey } from './paypalCardFieldsKey'

const props = defineProps<PayPalCardFieldsComponentOptions & { namespace?: string }>()

const { isReady, createCardFields } = usePaypal({ namespace: props.namespace })

const cardFields = ref<PayPalCardFieldsComponent | null>(null)
provide(paypalCardFieldsKey, cardFields)

watchEffect(() => {
  if (isReady.value && !cardFields.value)
    cardFields.value = createCardFields({ ...props })
})

defineExpose({
  submit: () => cardFields.value?.submit(),
  getState: () => cardFields.value?.getState(),
})
</script>

<template>
  <ClientOnly>
    <slot />
  </ClientOnly>
</template>
