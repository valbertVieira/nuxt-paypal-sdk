import type { InjectionKey, Ref } from 'vue'
import type { PayPalCardFieldsComponent } from '@paypal/paypal-js'

export const paypalCardFieldsKey: InjectionKey<Ref<PayPalCardFieldsComponent | null>>
  = Symbol('paypal-card-fields')
