'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CaretDown, List, X } from '@phosphor-icons/react'

import type { Header } from '@/payload-types'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({})
  const [imgError, setImgError] = useState(false)

  const navBodyRef = useRef<HTMLDivElement>(null)
  const dropdownWrapperRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()
  const { setHeaderTheme } = useHeaderTheme()

  const navItems = data?.navItems || []

  // Clear theme on mount/navigation
  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  // Reset mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsMobileMenuOpen(false)
        setActiveDropdown(null)
        document.body.style.overflow = 'auto'
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Desktop Dropdown Logic
  const handleMouseEnter = (targetId: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 992) return

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }

    const navBody = navBodyRef.current
    const targetMenu = document.getElementById(targetId)
    const trigger = e.currentTarget

    if (navBody && targetMenu && trigger) {
      const navBodyRect = navBody.getBoundingClientRect()
      const triggerRect = trigger.getBoundingClientRect()

      const menuWidth = targetMenu.offsetWidth
      const menuHeight = targetMenu.offsetHeight

      const triggerCenterRel = (triggerRect.left - navBodyRect.left) + (triggerRect.width / 2)
      const bgLeft = triggerCenterRel - (menuWidth / 2)

      setDropdownStyle({
        transform: `translateX(${bgLeft}px)`,
        width: `${menuWidth}px`,
        height: `${menuHeight}px`,
      })

      setActiveDropdown(targetId)
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth <= 992) return

    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 50)
  }

  const handleWrapperMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
  }

  // Mobile Toggle Logic
  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen
    setIsMobileMenuOpen(newState)
    document.body.style.overflow = newState ? 'hidden' : 'auto'
    if (!newState) {
      setMobileExpanded(null)
    }
  }

  const toggleMobileAccordion = (id: string) => {
    setMobileExpanded(prev => prev === id ? null : id)
  }

  return (
    <header className="navbar-container">
      <div className="nav-body" ref={navBodyRef}>
        <Link href="/" className="navbar-logo">
          <div style={{ width: '224px' }}>
            {data.logo && typeof data.logo === 'object' && 'url' in data.logo && !imgError && (
              <img
                src={data.logo.url as string}
                alt="SkillsforMed Logo"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onError={() => setImgError(true)}
              />
            )}
            {(!data.logo || typeof data.logo !== 'object' || imgError) && (
              <img
                src="/media/logo@2x.jpg"
                alt="SkillsforMed Logo"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            )}
          </div>
        </Link>
        {/* DESKTOP MENU */}
        <div className="nav-menu-wrapper">
          <nav className="nav-links">
            {navItems.map((item, i) => {
              if (item.type === 'link') {
                return (
                  <div key={item.id || i} className="nav-item">
                    <CMSLink {...item.link} className="nav-link" appearance="link" />
                  </div>
                )
              }

              // Sub-menu
              const targetId = item.id || `menu-${i}`
              return (
                <div
                  key={targetId}
                  className="nav-item"
                  data-dropdown-target={targetId}
                  onMouseEnter={(e) => handleMouseEnter(targetId, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="nav-link capitalize">
                    {item.label}
                    <CaretDown weight="bold" />
                  </span>
                </div>
              )
            })}
          </nav>

          {data.callToAction && (
            <div className="nav-buttons">
              <CMSLink {...data.callToAction} appearance="default" className="btn btn-solid" />
            </div>
          )}
        </div>

        {/* DESKTOP DROPDOWN WRAPPER */}
        <div
          className={`dropdown-wrapper ${activeDropdown ? 'open' : ''}`}
          ref={dropdownWrapperRef}
          onMouseEnter={handleWrapperMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="dropdown-background" style={dropdownStyle}></div>
          <div className="dropdown-content-area">
            {navItems.map((item, i) => {
              if (item.type !== 'sub-menu') return null
              const targetId = item.id || `menu-${i}`
              const isActive = activeDropdown === targetId

              return (
                <div
                  key={targetId}
                  className={`dropdown-menu ${isActive ? 'active' : ''}`}
                  id={targetId}
                  style={isActive ? { transform: dropdownStyle.transform } : undefined}
                >
                  {item.subMenuItems?.map((subItem, j) => (
                    <CMSLink
                      key={j}
                      {...subItem.link}
                      className="dropdown-item"
                      appearance="link"
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* STATIC ICON TOGGLE */}
        <button
          className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          aria-label="Toggle navigation"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X weight="bold" /> : <List weight="bold" />}
        </button>

        {/* FULL SCREEN MOBILE MENU */}
        <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <nav className="nav-links mobile">
            {navItems.map((item, i) => {
              if (item.type === 'link') {
                return (
                  <div key={item.id || i} className="nav-item">
                    <CMSLink {...item.link} className="nav-link" appearance="link" />
                  </div>
                )
              }

              // Mobile Sub-menu
              const targetId = item.id || `menu-${i}`
              return (
                <div key={targetId} className={`nav-item mobile-trigger ${mobileExpanded === targetId ? 'open' : ''}`}>
                  <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); toggleMobileAccordion(targetId) }}>
                    {item.label}
                    <CaretDown weight="bold" />
                  </a>
                  <div className="mobile-menu-content" style={{ display: mobileExpanded === targetId ? 'block' : 'none' }}>
                    {item.subMenuItems?.map((subItem, j) => (
                      <CMSLink
                        key={j}
                        {...subItem.link}
                        className="dropdown-item"
                        appearance="link"
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </nav>

          {data.callToAction && (
            <div className="nav-buttons">
              <CMSLink {...data.callToAction} appearance="default" className="btn btn-solid" />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
