import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'link',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Sub-menu', value: 'sub-menu' },
          ],
          required: true,
          admin: {
            width: '50%',
          },
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: (_, siblingData) => siblingData?.type === 'link',
            },
          },
        }),
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'sub-menu',
            width: '50%',
          },
        },
        {
          name: 'subMenuItems',
          type: 'array',
          labels: {
            singular: 'Sub-menu Item',
            plural: 'Sub-menu Items',
          },
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'sub-menu',
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    link({
      appearances: false,
      overrides: {
        name: 'callToAction',
        label: 'Call to Action',
      },
    }),
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
