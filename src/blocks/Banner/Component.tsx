'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { BannerBlock as BannerBlockProps, Media } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import styles from './styles.module.css'


type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = (props) => {
  const { slides } = props
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Clean up slides prop to ensure it's an array
  const safeSlides = slides || []
  const slideDuration = 8000
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      handleNext()
    }, slideDuration)
  }

  useEffect(() => {
    resetTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [safeSlides.length]) // Re-run if slides length changes

  useGSAP(() => {
    // Initial setup - hide all except first
    safeSlides.forEach((_, index) => {
        const slide = slidesRef.current[index]
        if (!slide) return
        
        if (index === currentSlideIndex) {
            gsap.set(slide, { opacity: 1, visibility: 'visible', zIndex: 10 })
        } else {
            gsap.set(slide, { opacity: 0, visibility: 'hidden', zIndex: 5 })
        }
    })
  }, { scope: containerRef, dependencies: [] }) // Run once on mount

  // Handle slide transitions
  useGSAP(() => {
    if (safeSlides.length === 0) return

    safeSlides.forEach((_, index) => {
        const slide = slidesRef.current[index]
        if(!slide) return

        if (index === currentSlideIndex) {
            gsap.to(slide, { 
                opacity: 1, 
                visibility: 'visible', 
                zIndex: 10, 
                duration: 0.5, 
                ease: 'power2.inOut' 
            })
        } else {
             // Delay zIndex change to allow opacity fade out transition to finish underneath
             gsap.to(slide, { 
                opacity: 0, 
                visibility: 'hidden', 
                duration: 0.5, 
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(slide, { zIndex: 5 })
                }
            })
        }
    })

  }, { scope: containerRef, dependencies: [currentSlideIndex] })


  const handleTabClick = (index: number) => {
    setCurrentSlideIndex(index)
    resetTimer()
  }

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 < 0 ? safeSlides.length - 1 : prev - 1))
    resetTimer()
  }

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % safeSlides.length)
    resetTimer()
  }

  if (!safeSlides.length) return null

  return (
    <div className={styles.carouselContainer} ref={containerRef}>
      
      {/* Tabs (Desktop Only) */}
      <div className={styles.carouselTabs}>
        {safeSlides.map((slide, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${index === currentSlideIndex ? styles.active : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {slide.tabLabel}
          </button>
        ))}
      </div>

      {/* Arrows (Mobile Only) */}
      <button className={`${styles.carouselArrow} ${styles.arrowPrev}`} onClick={handlePrev}>
        &#8249;
      </button>
      <button className={`${styles.carouselArrow} ${styles.arrowNext}`} onClick={handleNext}>
        &#8250;
      </button>

      <div className={styles.carouselSlides}>
        {safeSlides.map((slide, index) => {
           const desktopImg = slide.desktopImage as Media
           const mobileImg = slide.mobileImage as Media
           const desktopUrl = desktopImg?.url || ''
           const mobileUrl = mobileImg?.url || ''

          return (
            <div
              key={index}
              ref={(el) => { slidesRef.current[index] = el }}
              className={`${styles.carouselSlide} ${index === currentSlideIndex ? styles.active : ''}`}
              style={{
                 // Apply background image for desktop only via inline style or rely on class toggling?
                 // The CSS uses classes .slide-1 etc for bg images. We need dynamic ones.
                 // We'll use inline styles for the background image, but we need to ensure it's responsive (handled by CSS query mostly)
                 backgroundImage: `url(${desktopUrl})`
              }}
            >
              {/* Mobile Image Tag (Src can be different from desktop bg) */}
              {mobileUrl && (
                  <img 
                      src={mobileUrl} 
                      alt={mobileImg?.alt || slide.headline} 
                      className={styles.mobileImage} 
                  />
              )}

              <div className={styles.slideContent}>
                <h1 className={styles.slideHeadline}>{slide.headline}</h1>
                <p className={styles.slideDescription}>{slide.description}</p>
                
                  {/* Link handling */}
                  {(slide.link || slide.customLink) && (
                      <div className={styles.buttonWrapper}>
                           {/* If using Payload CMSLink component or simple anchor depends on props */}
                           {slide.link ? (
                               <CMSLink
                                  className={styles.slideButton}
                                  type="reference"
                                  reference={{
                                      relationTo: 'pages',
                                      value: slide.link?.value,
                                  }}
                                  label={slide.buttonText || 'Learn Now'}
                               />
                           ) : (
                              <a href={slide.customLink || '#'} className={styles.slideButton}>
                                  {slide.buttonText || 'Learn Now'}
                              </a>
                           )}
                      </div>
                  )}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.carouselDots}>
        {safeSlides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dotButton} ${index === currentSlideIndex ? styles.active : ''}`}
            onClick={() => handleTabClick(index)}
          ></button>
        ))}
      </div>
    </div>
  )
}
