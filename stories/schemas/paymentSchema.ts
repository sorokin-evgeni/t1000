import type { JSONSchema } from '../../src/core/types/schema'

export const paymentSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Payment Details',
  description: 'Enter your credit card information to complete the purchase.',
  type: 'object',
  required: ['cardholderName', 'cardNumber', 'expiryDate', 'cvv', 'billingZip'],
  properties: {
    cardholderName: {
      type: 'string',
      title: 'Cardholder Name',
      minLength: 2,
      maxLength: 100,
      description: 'Name as it appears on your card.',
    },
    cardNumber: {
      type: 'string',
      title: 'Card Number',
      pattern: '^[0-9]{13,19}$',
      minLength: 13,
      maxLength: 19,
      description: 'Enter digits only, no spaces.',
    },
    cardType: {
      type: 'string',
      title: 'Card Type',
      enum: ['Visa', 'Mastercard', 'American Express', 'Discover', 'Other'],
    },
    expiryDate: {
      type: 'string',
      title: 'Expiry Date',
      format: 'date',
      description: 'Select the last day of the expiry month.',
    },
    cvv: {
      type: 'string',
      title: 'CVV / Security Code',
      pattern: '^[0-9]{3,4}$',
      minLength: 3,
      maxLength: 4,
      description: '3 or 4 digit code on the back of your card.',
    },
    billingZip: {
      type: 'string',
      title: 'Billing ZIP Code',
      pattern: '^[A-Za-z0-9\\s\\-]{3,10}$',
      description: 'ZIP or postal code for your billing address.',
    },
    saveCard: {
      type: 'boolean',
      title: 'Save this card for future purchases',
    },
    amount: {
      type: 'number',
      title: 'Amount (USD)',
      minimum: 0.01,
      maximum: 10000,
      description: 'Total amount to charge.',
    },
  },
}

export const paymentDefaults: Record<string, unknown> = {}
