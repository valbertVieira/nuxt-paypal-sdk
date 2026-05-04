<script setup lang="ts">
import type { PayPalCardFieldsIndividualFieldOptions } from '@paypal/paypal-js'
import { inject, useTemplateRef, watchEffect } from 'vue'
import { paypalCardFieldsKey } from './paypalCardFieldsKey'

const props = defineProps<PayPalCardFieldsIndividualFieldOptions>()

const cardFields = inject(paypalCardFieldsKey, null)
const fieldEl = useTemplateRef<HTMLDivElement>('field-el')

watchEffect(() => {
  if (cardFields?.value && fieldEl.value)
    cardFields.value.NameField({ ...props }).render(fieldEl.value)
})
</script>

<template>
  <div ref="field-el" />
</template>
