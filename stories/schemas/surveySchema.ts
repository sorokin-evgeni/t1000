import type { JSONSchema } from '../../src/core/types/schema'

export const surveySchema: JSONSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Product Feedback Survey',
  description: 'Help us improve by sharing your experience.',
  type: 'object',
  required: ['overallRating', 'recommend'],
  properties: {
    overallRating: {
      type: 'string',
      title: 'Overall Rating',
      enum: ['5 - Excellent', '4 - Good', '3 - Average', '2 - Poor', '1 - Very Poor'],
      description: 'How would you rate your overall experience?',
    },
    easeOfUse: {
      type: 'string',
      title: 'Ease of Use',
      enum: ['Very Easy', 'Easy', 'Neutral', 'Difficult', 'Very Difficult'],
    },
    usageFrequency: {
      type: 'string',
      title: 'How often do you use our product?',
      enum: ['Daily', 'Several times a week', 'Once a week', 'A few times a month', 'Rarely'],
    },
    recommend: {
      type: 'string',
      title: 'Would you recommend us?',
      enum: ['Definitely yes', 'Probably yes', 'Not sure', 'Probably not', 'Definitely not'],
    },
    favoriteFeature: {
      type: 'string',
      title: 'Favorite Feature',
      enum: ['Dashboard', 'Reporting', 'Integrations', 'Mobile App', 'Customer Support', 'Other'],
    },
    startDate: {
      type: 'string',
      title: 'When did you start using the product?',
      format: 'date',
    },
    additionalComments: {
      type: 'string',
      title: 'Additional Comments',
      format: 'textarea',
      maxLength: 1000,
      description: 'Any other feedback you would like to share?',
    },
    newsletter: {
      type: 'boolean',
      title: 'Subscribe to our newsletter for product updates',
    },
  },
}

export const surveyDefaults: Record<string, unknown> = {}
