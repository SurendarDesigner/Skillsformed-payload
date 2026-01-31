import type { Block } from 'payload'

export const Banner: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlock',
  fields: [
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 10,
      fields: [
        {
          name: 'tabLabel',
          type: 'text',
          required: true,
          label: 'Tab Label (Desktop)',
        },
        {
          name: 'headline',
          type: 'textarea',
          required: true,
          label: 'Headline',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
        {
          name: 'link',
          type: 'relationship',
          relationTo: ['pages'],
          required: false,
          label: 'Link (Optional)',
        },
        {
          name: 'customLink',
          type: 'text',
          label: 'Custom Link (if not using Page relationship)',
        },
        {
          name: 'buttonText',
          type: 'text',
          defaultValue: 'Learn Now',
          label: 'Button Text',
        },
        {
          name: 'desktopImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Desktop Background Image',
        },
        {
          name: 'mobileImage',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Mobile Image',
        },
      ],
    },
  ],
}
