import type { Block } from 'payload'

export const CompanyMetrics: Block = {
  slug: 'companyMetrics',
  interfaceName: 'CompanyMetricsBlock',
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'Trusted by Leading Institutions and 30,000+ Professionals.',
    },
    {
      name: 'metrics',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Metric Value (e.g. 30,000+)',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Metric Label (e.g. Professionals Upskilled)',
        },
      ],
    },
  ],
}
