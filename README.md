# Paypal Nuxt

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Standalone PayPal components for Nuxt applications.

> **Scope:** this module wraps the PayPal **client-side JavaScript SDK** ([@paypal/paypal-js](https://github.com/paypal/paypal-js)) — buttons, marks, messages, funding eligibility. Server-side integration with the PayPal REST API (order capture, subscriptions management, webhooks) is **out of scope** and remains the consumer's responsibility.

- [Release Notes](/CHANGELOG.md)

## Features

- Drop-in `<PaypalButton>`, `<PaypalMarks>`, `<PaypalMessages>` components — auto-imported.
- `usePaypal()` composable with full SDK access (load helpers, funding eligibility utilities).
- Type-safe configuration synced with `@paypal/paypal-js` — every script/component option is autocompleted.
- Multi-namespace support to coexist different PayPal SDK instances on the same page (e.g. one-time order + subscription).


## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxt module add paypal-nuxt
```

Then configure your client ID:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['paypal-nuxt'],
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
  },
})
```

Use the components anywhere in your app — auto-imported, no manual import needed:

```vue
<script setup lang="ts">
import type { PayPalButtonCreateOrder, PayPalButtonOnApprove } from '@paypal/paypal-js'

const createOrder: PayPalButtonCreateOrder = (_, actions) => {
  return actions.order.create({
    purchase_units: [{ amount: { value: '10.00', currency_code: 'USD' } }],
  })
}

const onApprove: PayPalButtonOnApprove = async (_, actions) => {
  await actions.order.capture()
}
</script>

<template>
  <PaypalButton :create-order="createOrder" :on-approve="onApprove" />
</template>
```

## Configuration

The `paypal` key in `nuxt.config.ts` accepts every option from `PayPalScriptOptions` (full SDK script parameters). Most common:

```ts
paypal: {
  clientId: '...',
  currency: 'USD',
  intent: 'capture',
  components: ['buttons', 'marks', 'messages', 'funding-eligibility'],
  enableFunding: ['venmo'],
  disableFunding: ['credit'],
  buyerCountry: 'US',     // sandbox only
  environment: 'sandbox',
}
```

For all available options, see [PayPal SDK reference](https://developer.paypal.com/sdk/js/reference/).

## Components

### `<PaypalButton>`

Renders a PayPal Smart Button. All props are typed against `PayPalButtonsComponentOptions`:

```vue
<PaypalButton
  funding-source="paypal"
  :create-order="createOrder"
  :on-approve="onApprove"
  :on-cancel="onCancel"
  :on-error="onError"
  :style="{ layout: 'vertical', color: 'gold' }"
/>
```

Omit `funding-source` to render all eligible buttons at once.

### `<PaypalMarks>`

Renders payment-method indicators (radio-style icons). Useful when displaying PayPal alongside other payment options:

```vue
<PaypalMarks />
<PaypalMarks funding-source="paypal" />
```

Requires `marks` in the `components` array.

### `<PaypalMessages>`

Renders a Pay Later promotional banner:

```vue
<PaypalMessages
  :amount="299.90"
  placement="product"
  :style="{ layout: 'flex', ratio: '8x1', color: 'blue' }"
/>
```

Requires `messages` in the `components` array, and a supported `buyerCountry` (US, GB, DE, FR…).

## Composable

`usePaypal()` is auto-imported. It returns:

```ts
const {
  isReady,            // computed<boolean> — true when SDK is loaded
  renderButton,       // (target, options?) => Promise<void>
  renderMark,         // (target, options?) => Promise<void>
  renderMessage,      // (target, options?) => Promise<void>
  getFundingSources,  // () => FUNDING_SOURCE[]
  isFundingEligible,  // (source) => boolean
} = usePaypal()
```

### Per-page configuration overrides

Pass options to override the global `nuxt.config.ts` config for that page:

```vue
<!-- pages/subscription.vue -->
<script setup>
usePaypal({ intent: 'subscription', vault: true })
</script>

<template>
  <PaypalButton :create-subscription="createSub" :on-approve="onApprove" />
</template>
```

The SDK is reloaded automatically when overrides differ from the currently loaded config.

### Funding-eligibility utilities

Used to render conditionally based on what the buyer can use:

```vue
<script setup>
const { isReady, getFundingSources, isFundingEligible } = usePaypal()

const sources = computed(() => isReady.value ? getFundingSources() : [])
const venmoOk = computed(() => isReady.value && isFundingEligible('venmo'))
</script>

<template>
  <PaypalButton
    v-for="src in sources"
    :key="src"
    :funding-source="src"
    :create-order="createOrder"
  />
  <p v-if="venmoOk">Venmo is available</p>
</template>
```

Requires `funding-eligibility` in the `components` array.

## Multiple SDK instances (namespaces)

If you need both a one-time-order button **and** a subscription button on the same page, load two SDK instances using namespaces:

```vue
<script setup>
usePaypal({ namespace: 'orders', intent: 'capture' })
usePaypal({ namespace: 'subs', intent: 'subscription', vault: true })
</script>

<template>
  <PaypalButton namespace="orders" :create-order="createOrder" />
  <PaypalButton namespace="subs" :create-subscription="createSub" />
</template>
```

Each namespace is isolated — separate `<script>` tag, separate `window[namespace]` global, separate state. Loads about ~70KB extra per additional namespace.

## Contribution

<details>
  <summary>Local development</summary>

  ```bash
  # Install dependencies
  npm install

  # Generate type stubs
  npm run dev:prepare

  # Develop with the playground
  npm run dev

  # Build the playground
  npm run dev:build

  # Run ESLint
  npm run lint

  # Run Vitest
  npm run test
  npm run test:watch

  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/paypal-nuxt/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/paypal-nuxt

[npm-downloads-src]: https://img.shields.io/npm/dm/paypal-nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/paypal-nuxt

[license-src]: https://img.shields.io/npm/l/paypal-nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/paypal-nuxt

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
