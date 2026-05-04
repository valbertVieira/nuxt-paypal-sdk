<script setup lang="ts">
import type { CreateOrderActions, CreateOrderData, CardFieldsOnApproveData } from '@paypal/paypal-js'

const cf = useTemplateRef('cf')

async function createOrder() {
  return '2'
  await $fetch('/api/paypal/create-order', { method: 'POST' })
}

function onApprove(data: CardFieldsOnApproveData) {
  console.log('approved order', data.orderID)
}

usePaypal({
  enableFunding: 'venmo',
  buyerCountry: 'US',
})
</script>

<template>
  <div>
    <PaypalButton
      :create-order="createOrder"
      funding-source="paypal"
    />

    <PaypalButton
      :create-order="createOrder"
      funding-source="venmo"
    />

    <PaypalButton
      :create-order="createOrder"
      funding-source="card"
    />

    <PaypalMarks />

    <PaypalMessages />

    <PaypalCardFields
      ref="cf"
      :create-order="createOrder"
      :on-approve="(onApprove)"
      @error="() => {}"
    >
      <PaypalCardNumber />
      <PaypalCardExpiry />
      <PaypalCardCvv />
      <PaypalCardName />
    </PaypalCardFields>

    <button @click="cf?.submit()">
      Pay
    </button>
  </div>
</template>
