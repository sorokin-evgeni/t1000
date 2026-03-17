import type { JSONSchema } from '../../src/core/types/schema'

export const registrationSchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Create Account',
  description: 'Fill in the details below to create your account.',
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password', 'age', 'terms'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: 'string',
      title: 'Email Address',
      format: 'email',
      description: 'We will send a confirmation to this address.',
    },
    password: {
      type: 'string',
      title: 'Password',
      format: 'password',
      minLength: 8,
      description: 'At least 8 characters.',
    },
    age: {
      type: 'integer',
      title: 'Age',
      minimum: 18,
      maximum: 120,
      description: 'You must be at least 18 years old.',
    },
    terms: {
      type: 'boolean',
      title: 'I agree to the Terms of Service and Privacy Policy',
    },
  },
}

export const registrationDefaults: Record<string, unknown> = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  password: 'securepass123',
  age: 28,
  terms: true,
}
