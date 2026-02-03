import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',

  meta: {
    description: 'An open-source website built with Payload and Next.js.',
    title: 'Payload Website Template',
  },
  title: 'Home',
  layout: [
    {
      blockType: 'banner',
      slides: [
        {
          tabLabel: 'Elevate',
          headline: 'A platform which helps healthcare professionals to shape their future and deliver better patient care.',
          description: 'India’s first AI-enabled platform for personalized clinical upskilling and career development in healthcare.',
          desktopImage: { url: '/banner1@2x.jpg', alt: 'Elevate' } as any,
          mobileImage: { url: '/mobile_banner1@2x.jpg', alt: 'Elevate' } as any,
          buttonText: 'Learn Now',
          customLink: 'courses.html',
        },
        {
          tabLabel: 'Upskill',
          headline: 'Strengthen clinical competence to improve patient care',
          description: 'Elevate your career, impact, and earning potential with continuous, career-shaping learning.',
          desktopImage: { url: '/banner2@2x.jpg', alt: 'Upskill' } as any,
          mobileImage: { url: '/mobile_banner2@2x.jpg', alt: 'Upskill' } as any,
          buttonText: 'Learn Now',
          customLink: 'courses.html',
        },
        {
          tabLabel: 'Reskill',
          headline: 'Expand into new specialities and allied healthcare roles.',
          description: 'Unlock new specialties and allied roles with guided learning built for seamless career transitions.',
          desktopImage: { url: '/banner3@2x.jpg', alt: 'Reskill' } as any,
          mobileImage: { url: '/mobile_banner3@2x.jpg', alt: 'Reskill' } as any,
          buttonText: 'Learn Now',
          customLink: 'courses.html',
        },
        {
          tabLabel: 'Empower',
          headline: 'Build Leadership, Drive Better Care',
          description: 'Develop healthcare leaders with advanced training in clinical and operational leadership, empowering teams to deliver safer, more efficient patient care.',
          desktopImage: { url: '/banner4@2x.jpg', alt: 'Empower' } as any,
          mobileImage: { url: '/mobile_banner4@2x.jpg', alt: 'Empower' } as any,
          buttonText: 'Learn Now',
          customLink: 'courses.html',
        },
      ],
    },
  ],
}
