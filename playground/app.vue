<script setup lang="ts">
async function createOrder() {
  return '123'
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
  </div>
</template>
