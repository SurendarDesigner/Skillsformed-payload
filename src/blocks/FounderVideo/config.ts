import type { Block } from 'payload'

export const FounderVideo: Block = {
  slug: 'founderVideo',
  interfaceName: 'FounderVideoBlock',
  fields: [
    {
      name: 'videoType',
      type: 'radio',
      options: [
        {
          label: 'Upload File',
          value: 'upload',
        },
        {
          label: 'External URL',
          value: 'url',
        },
      ],
      defaultValue: 'upload',
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Video File',
      admin: {
        condition: (_, siblingData) => siblingData?.videoType === 'upload',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.videoType === 'url',
        description: 'Paste a direct link to the video file (mp4, webm, etc.)',
      },
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Video Thumbnail',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      label: 'Quote Text',
      defaultValue: 'If we want stronger healthcare in India, we must first strengthen the people who make it possible.',
    },
    {
      name: 'authorName',
      type: 'text',
      required: true,
      label: 'Author Name',
      defaultValue: 'Dr. Parivalavan Rajavelu',
    },
    {
      name: 'authorRole',
      type: 'text',
      required: true,
      label: 'Author Role',
      defaultValue: 'Deputy Medical Director and Consultant Surgeon, Sundaram Medical Foundation',
    },
    {
      name: 'authorDesignation',
      type: 'text',
      required: true,
      label: 'Author Designation',
      defaultValue: 'Founder of SkillsforMed',
    },
    {
        name: 'buttonText',
        type: 'text',
        label: 'Button Text',
        defaultValue: 'Get Started',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Form to Open',
      admin: {
        description: 'Select a form to display when the button is clicked.',
      },
    },
  ],
}
