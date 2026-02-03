'use client'


import React, { useState, useEffect } from 'react'
import type { FounderVideoBlock as FounderVideoBlockProps, Media, Form as FormType } from '@/payload-types'
import { FormBlock } from '@/blocks/Form/Component'
import styles from './styles.module.css'
import Image from 'next/image'
import { CaretRight, X } from '@phosphor-icons/react'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as any

type Props = {
  className?: string
  // Temporarily extending props manually since types haven't regenerated
  videoType?: 'upload' | 'url' | null
  videoUrl?: string | null
} & FounderVideoBlockProps

export const FounderVideoBlock: React.FC<Props> = (props) => {
  const { 
    video, 
    thumbnail, 
    quote, 
    authorName, 
    authorRole, 
    authorDesignation, 
    buttonText,
    form,
    videoType,
    videoUrl: videoUrlProp,
  } = props

  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const videoFile = video as Media
  
  // Fallback logic: check explicit type, then check if url exists, then check file
  const videoUrlRaw = videoType === 'url' && videoUrlProp ? videoUrlProp : (videoUrlProp || '')
  const finalVideoUrl = videoUrlRaw.trim() || videoFile?.url

  // Helper to detect social media URLs
  const isSocialEmbed = (url?: string | null) => {
    if (!url) return false
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')
  }

  const thumbnailFile = thumbnail as Media
  const formObj = form as FormType

  const openVideo = () => setIsVideoOpen(true)
  const closeVideo = () => {
    setIsVideoOpen(false)
  }

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <div className={styles.section}>
      {/* Video Thumbnail Section */}
      <div className={styles.videoWrapper}>
        {thumbnailFile?.url && (
            <Image 
                src={thumbnailFile.url} 
                alt={thumbnailFile.alt || 'Video Thumbnail'} 
                fill
                className={styles.thumbnail}
            />
        )}
        <div className={styles.playIcon} onClick={openVideo}>
             {/* Using a simple inline SVG for the play icon or could be an image asset */}
             <Image 
                 src="/assets/play_icon.svg" 
                 alt="Play Video" 
                 width={100} 
                 height={100} 
                 className={styles.playIconSvg}
             />
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentMain}>
        <div className={styles.quoteWrapper}>
             <Image 
                 src="/assets/quote_icon.svg" 
                 alt="Quote" 
                 width={62} 
                 height={48} 
                 className={styles.quoteIcon}
             />
            <h3 className={styles.quoteText}>{quote}</h3>
        </div>

        <div className={styles.authorInfoMain}>
            <div className={styles.authorInfo}>
                <p className={styles.authorName}>{authorName}</p>
                <p className={styles.authorRole}>{authorRole}</p>
            </div>
            <p className={styles.authorDesignation} dangerouslySetInnerHTML={{ __html: authorDesignation }}></p>
        </div>

        <button className={styles.button} onClick={openForm}>
            {buttonText || 'Get Started'}
            <CaretRight weight="bold" />
        </button>
      </div>

      {/* Video Modal */}
      {isVideoOpen && finalVideoUrl && (
          <div className={styles.modalOverlay} onClick={closeVideo}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <button className={styles.closeButton} onClick={closeVideo}>
                      <X weight="bold" />
                  </button>
                  <div className={styles.playerWrapper}>
                    {isSocialEmbed(finalVideoUrl) ? (
                      <ReactPlayer 
                        url={finalVideoUrl} 
                        className={styles.reactPlayer}
                        width="100%" 
                        height="100%" 
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        controls 
                        playing={true}
                        muted={true}
                        playsinline
                        onError={(e: any) => console.error('Video error:', e)}
                      />
                    ) : (
                      <video 
                        src={finalVideoUrl}
                        className={styles.reactPlayer} /* Reuse same absolute positioning class */
                        controls
                        autoPlay
                        muted
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}
                  </div>
              </div>
          </div>
      )}

      {/* Form Modal */}
      {isFormOpen && formObj && (
          <div className={styles.modalOverlay} onClick={closeForm}>
              <div className={`${styles.modalContent} ${styles.formModalContent}`} onClick={(e) => e.stopPropagation()}>
                    <button className={styles.closeButton} style={{ color: '#333', top: '16px', right: '16px' }} onClick={closeForm}>
                      <X weight="bold" />
                    </button>
                    {/* Render the Payloads Form Block */}
                    {/* We construct a temporary 'block' object to pass to FormBlock component if needed, or if FormBlock accepts form directly */}
                    {/* Checking FormBlock props: it takes { form: number | Form, ... } */}
                   <FormBlock form={formObj} enableIntro={false} />
              </div>
          </div>
      )}
    </div>
  )
}
