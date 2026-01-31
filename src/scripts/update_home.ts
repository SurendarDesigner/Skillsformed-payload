
import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const updateHome = async () => {
    const payload = await getPayload({ config: configPromise })

    // 1. Find or Create a Placeholder Image
    let mediaId = null
    const media = await payload.find({
        collection: 'media',
        limit: 1,
    })

    if (media.totalDocs > 0) {
        mediaId = media.docs[0].id
        console.log(`Using existing media ID: ${mediaId}`)
    } else {
        console.log('No media found. Attempting to seed a placeholder image...')
        const seedImagePath = path.resolve(__dirname, '../endpoints/seed/image-hero1.webp')
        
        if (fs.existsSync(seedImagePath)) {
             try {
                const newMedia = await payload.create({
                    collection: 'media',
                    data: {
                        alt: 'Placeholder Banner',
                    },
                    file: {
                        path: seedImagePath,
                        name: 'placeholder-banner.webp',
                        mimetype: 'image/webp',
                        size: fs.statSync(seedImagePath).size,
                    } as any,
                })
                mediaId = newMedia.id
                console.log(`Created new media ID: ${mediaId}`)
             } catch (e) {
                 console.error('Failed to create seed media:', e)
             }
        } else {
            console.error('Seed image not found at:', seedImagePath)
        }
    }

    if (!mediaId) {
        console.error('Cannot proceed without a valid media ID for the required image fields.')
        process.exit(1)
    }

    // 2. Find Home Page
    const pages = await payload.find({
        collection: 'pages',
        where: {
            slug: {
                equals: 'home',
            },
        },
        limit: 1,
    })

    if (pages.totalDocs > 0) {
        const homePage = pages.docs[0]
        console.log(`Found home page with ID: ${homePage.id}`)

        // 3. Construct Banner Block with valid Media ID
        const bannerBlock = {
            blockType: 'banner',
            slides: [
                {
                    tabLabel: 'Elevate',
                    headline: 'A platform which helps healthcare professionals to shape their future and deliver better patient care.',
                    description: 'India’s first AI-enabled platform for personalized clinical upskilling and career development in healthcare.',
                    desktopImage: mediaId,
                    mobileImage: mediaId,
                    buttonText: 'Learn Now',
                    customLink: 'courses.html',
                },
                {
                  tabLabel: 'Upskill',
                  headline: 'Strengthen clinical competence to improve patient care',
                  description: 'Elevate your career, impact, and earning potential with continuous, career-shaping learning.',
                  desktopImage: mediaId,
                  mobileImage: mediaId,
                  buttonText: 'Learn Now',
                  customLink: 'courses.html',
                },
                {
                  tabLabel: 'Reskill',
                  headline: 'Expand into new specialities and allied healthcare roles.',
                  description: 'Unlock new specialties and allied roles with guided learning built for seamless career transitions.',
                  desktopImage: mediaId,
                  mobileImage: mediaId,
                  buttonText: 'Learn Now',
                  customLink: 'courses.html',
                },
                {
                  tabLabel: 'Empower',
                  headline: 'Build Leadership, Drive Better Care',
                  description: 'Develop healthcare leaders with advanced training in clinical and operational leadership, empowering teams to deliver safer, more efficient patient care.',
                  desktopImage: mediaId,
                  mobileImage: mediaId,
                  buttonText: 'Learn Now',
                  customLink: 'courses.html',
                },
            ],
        }

        // 4. Update Layout & Hero
        // We want to replace the entire layout with just the banner
        // AND disable the default hero.
        
        await payload.update({
            collection: 'pages',
            id: homePage.id,
            data: {
                hero: {
                    type: 'none',
                    richText: {}, // Empty rich text just in case
                    media: null,
                    links: [],
                },
                layout: [bannerBlock],
            },
        })

        console.log('Successfully updated Home Page layout: Replaced with Banner and disabled Hero.')
    } else {
        console.log('No page with slug "home" found. Creating one...')
         // Optional: Creating the page if it doesn't exist
         /* 
         await payload.create({
             collection: 'pages',
             data: {
                 title: 'Home',
                 slug: 'home',
                 layout: [bannerBlock], // Need to move bannerBlock definition up if uncommenting
             }
         }) 
         */
        console.log('Please ensure you have run the seed script or created a Home page.')
    }
    process.exit(0)
}

updateHome()
