import type { JSONSchema } from '../../src/core/types/schema'

export const profileSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'User Profile',
  description: 'Update your personal information and address.',
  type: 'object',
  required: ['displayName', 'email'],
  properties: {
    displayName: {
      type: 'string',
      title: 'Display Name',
      minLength: 2,
      maxLength: 80,
    },
    email: {
      type: 'string',
      title: 'Email Address',
      format: 'email',
    },
    bio: {
      type: 'string',
      title: 'Bio',
      format: 'textarea',
      maxLength: 500,
      description: 'Tell others a bit about yourself (max 500 characters).',
    },
    birthDate: {
      type: 'string',
      title: 'Date of Birth',
      format: 'date',
    },
    address: {
      type: 'object',
      title: 'Address',
      description: 'Your mailing address.',
      required: ['city', 'country'],
      properties: {
        street: {
          type: 'string',
          title: 'Street Address',
        },
        city: {
          type: 'string',
          title: 'City',
          minLength: 2,
        },
        state: {
          type: 'string',
          title: 'State / Province',
        },
        zip: {
          type: 'string',
          title: 'ZIP / Postal Code',
          pattern: '^[A-Za-z0-9\\s\\-]{3,10}$',
          description: 'Letters, numbers, spaces, and dashes only.',
        },
        country: {
          type: 'string',
          title: 'Country',
          enum: [
            'United States',
            'Canada',
            'United Kingdom',
            'Australia',
            'Germany',
            'France',
            'Spain',
            'Italy',
            'Japan',
            'Other',
          ],
        },
      },
    },
  },
}

export const profileDefaults: Record<string, unknown> = {
  displayName: 'Jane Doe',
  email: 'jane.doe@example.com',
  bio: 'Software engineer passionate about open source and great UX.',
  birthDate: '1995-06-15',
  address: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
  },
}
