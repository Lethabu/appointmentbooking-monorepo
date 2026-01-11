# 🚀 MEDIUM-TERM ENHANCEMENT PLAN

## Appointment Booking Platform - Advanced Features & Optimization

**Timeline:** 6-12 weeks  
**Priority:** HIGH - Performance & User Experience Enhancement  
**Document Version:** 1.0  
**Created:** December 30, 2025  
**Status:** PLANNING PHASE

---

## 📋 EXECUTIVE SUMMARY

**OBJECTIVE:** Transform the appointment booking platform from a functional system into a market-leading SaaS solution with advanced features, enterprise capabilities, and exceptional user experience. This plan focuses on SEO optimization, accessibility compliance, advanced analytics, and intelligent automation.

### **Key Enhancements:**

- ✅ SEO optimization with structured data and local business markup
- ✅ WCAG 2.1 AA accessibility compliance implementation
- ✅ Advanced reporting and analytics dashboard
- ✅ Automated reminder system with multi-channel notifications
- ✅ A/B testing framework for booking optimization

### **Success Metrics:**

- SEO score >85/100
- Accessibility score >95/100
- Booking conversion rate +40%
- User engagement +60%
- Mobile performance score >90/100

---

## 🎯 PHASE 1: SEO OPTIMIZATION IMPLEMENTATION (WEEKS 6-8)

### **Week 6: Technical SEO Foundation**

#### **Day 1-2: Structured Data Implementation**

**Morning (0-4 hours):**

```typescript
// Local business structured data
// File: apps/booking/components/seo/LocalBusinessSchema.tsx
import { Script } from 'next/script'

interface LocalBusinessSchemaProps {
  businessName: string
  address: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  phone: string
  email: string
  website: string
  hours: {
    [key: string]: { open: string; close: string }
  }
  services: string[]
  geo: {
    latitude: number
    longitude: number
  }
}

export function LocalBusinessSchema({
  businessName,
  address,
  phone,
  email,
  website,
  hours,
  services,
  geo
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessName,
    "image": `${website}/images/logo.png`,
    "url": website,
    "telephone": phone,
    "email": email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address.street,
      "addressLocality": address.city,
      "addressRegion": address.province,
      "postalCode": address.postalCode,
      "addressCountry": address.country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": geo.latitude,
      "longitude": geo.longitude
    },
    "openingHoursSpecification": Object.entries(hours).map(([day, hours]) => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": day,
      "opens": hours.open,
      "closes": hours.close
    })),
    "sameAs": [
      `https://instagram.com/${businessName.toLowerCase().replace(/\s+/g, '')}`,
      `https://facebook.com/${businessName.toLowerCase().replace(/\s+/g, '')}`,
      `https://wa.me/${phone.replace(/\D/g, '')}`
    ],
    "priceRange": "$$",
    "servesCuisine": "Hair and Beauty Services",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  }

  return (
    <>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    </>
  )
}

// Service-specific structured data
// File: apps/booking/components/seo/ServiceSchema.tsx
interface ServiceSchemaProps {
  service: {
    name: string
    description: string
    duration: number
    price: number
    category: string
  }
  provider: {
    name: string
    address: string
  }
}

export function ServiceSchema({ service, provider }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": provider.name,
      "address": provider.address
    },
    "category": service.category,
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "ZAR",
      "availability": "https://schema.org/InStock"
    },
    "duration": `PT${service.duration}M`,
    "areaServed": "South Africa",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://appointmentbooking.co.za",
      "servicePhone": "+27699171527"
    }
  }

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}
```

**Afternoon (4-8 hours):**

```typescript
// Comprehensive meta tag management
// File: apps/booking/components/seo/MetaManager.tsx
import Head from 'next/head'

interface MetaManagerProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  canonical?: string
  noindex?: boolean
  structuredData?: object
}

export function MetaManager({
  title,
  description,
  keywords,
  ogImage = '/images/og-default.jpg',
  canonical,
  noindex = false,
  structuredData
}: MetaManagerProps) {
  const siteName = 'Appointment Booking Platform'
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`
  const siteUrl = 'https://appointmentbooking.co.za'

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={canonical || siteUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_ZA" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* South African Localization */}
      <meta name="geo.region" content="ZA" />
      <meta name="geo.placename" content="South Africa" />
      <meta name="geo.position" content="-26.2041;28.0473" />
      <meta name="ICBM" content="-26.2041, 28.0473" />

      {/* Language and Currency */}
      <meta httpEquiv="content-language" content="en-za" />
      <meta name="currency" content="ZAR" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Appointment Booking Platform" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="referrer" content="origin-when-cross-origin" />
    </Head>
  )
}

// FAQ Schema Component
// File: apps/booking/components/seo/FAQSchema.tsx
interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

---

### **Week 7: Content Optimization & Performance**

#### **Day 5-7: SEO Content Enhancement**

**Morning (0-4 hours):**

```typescript
// SEO content manager
// File: apps/booking/lib/seo-content-manager.ts
interface SEOContent {
  pageType: 'home' | 'service' | 'category' | 'location' | 'booking'
  primaryKeyword: string
  secondaryKeywords: string[]
  content: {
    title: string
    metaDescription: string
    h1: string
    h2s: string[]
    paragraphs: string[]
    callToActions: string[]
  }
  localSEO?: {
    city: string
    province: string
    region: string
  }
}

export class SEOContentManager {
  private static templates: Record<string, SEOContent> = {
    homePage: {
      pageType: 'home',
      primaryKeyword: 'appointment booking',
      secondaryKeywords: ['online booking', 'schedule appointment', 'book online'],
      content: {
        title: 'Professional Appointment Booking Platform - South Africa',
        metaDescription: 'Book appointments online with South Africa\'s leading booking platform. Easy scheduling, secure payments, and professional service management.',
        h1: 'Book Appointments Online - Fast, Easy & Secure',
        h2s: [
          'Why Choose Our Booking Platform?',
          'How It Works',
          'Popular Services',
          'Customer Reviews'
        ],
        paragraphs: [
          'Streamline your appointment booking process with our secure, user-friendly platform. Whether you\'re booking hair appointments, medical consultations, or professional services, we make scheduling effortless.',
          'Our platform connects you with trusted service providers across South Africa, offering real-time availability, secure payments, and automated reminders.'
        ],
        callToActions: [
          'Book Your Appointment Now',
          'Find Services Near You',
          'Join Our Network'
        ]
      },
      localSEO: {
        city: 'South Africa',
        province: 'Western Cape',
        region: 'Cape Town'
      }
    },
    servicePage: {
      pageType: 'service',
      primaryKeyword: 'hair appointment booking',
      secondaryKeywords: ['hair salon booking', 'stylist appointment', 'haircut booking'],
      content: {
        title: 'Book Hair Appointment - Professional Hair Services',
        metaDescription: 'Schedule your hair appointment with professional stylists. Online booking, flexible times, and premium hair services in your area.',
        h1: 'Book Your Hair Appointment Today',
        h2s: [
          'Professional Hair Services',
          'Experienced Stylists',
          'Premium Products',
          'Book Your Appointment'
        ],
        paragraphs: [
          'Experience premium hair services with our network of professional stylists. From cuts and color to treatments and styling, book your appointment with ease.',
          'Our certified stylists use premium products and the latest techniques to deliver exceptional results. Book online for convenient scheduling.'
        ],
        callToActions: [
          'Book Hair Service',
          'View Stylist Profiles',
          'Check Availability'
        ]
      }
    }
  }

  static generateContent(pageType: string, context?: any): SEOContent {
    const template = this.templates[pageType]
    if (!template) {
      throw new Error(`No SEO template found for page type: ${pageType}`)
    }

    // Customize content based on context
    if (context?.tenantName) {
      template.content.title = template.content.title.replace(
        'Professional Hair Services', 
        `Professional Hair Services - ${context.tenantName}`
      )
      template.content.h1 = template.content.h1.replace(
        'Book Your Hair Appointment Today',
        `Book Your Hair Appointment at ${context.tenantName}`
      )
    }

    if (context?.city) {
      template.localSEO = {
        city: context.city,
        province: context.province,
        region: context.region
      }
    }

    return template
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  static generateBreadcrumbs(path: string): Array<{name: string, url: string}> {
    const parts = path.split('/').filter(Boolean)
    const breadcrumbs = [{ name: 'Home', url: '/' }]
    
    let currentPath = ''
    parts.forEach(part => {
      currentPath += `/${part}`
      breadcrumbs.push({
        name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
        url: currentPath
      })
    })
    
    return breadcrumbs
  }
}
```

---

## ♿ PHASE 2: WCAG 2.1 AA ACCESSIBILITY COMPLIANCE (WEEKS 8-10)

### **Week 8: Accessibility Foundation**

#### **Day 1-2: Accessibility Components Library**

**Morning (0-4 hours):**

```typescript
// Accessible button component
// File: apps/booking/components/ui/accessible-button.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
}

const AccessibleButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, loadingText, children, disabled, 'aria-describedby': ariaDescribedby, ...props }, ref) => {
    const isDisabled = disabled || loading
    
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isDisabled}
        aria-describedby={ariaDescribedby}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {loading && loadingText ? loadingText : children}
      </button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton"

export { AccessibleButton, buttonVariants }

// Accessible form components
// File: apps/booking/components/ui/accessible-input.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500 focus-visible:ring-red-500",
        success: "border-green-500 focus-visible:ring-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label: string
  error?: string
  success?: string
  helpText?: string
  required?: boolean
}

const AccessibleInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, label, error, success, helpText, required, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = `${inputId}-error`
    const helpId = `${inputId}-help`
    const successId = `${inputId}-success`

    return (
      <div className="space-y-2">
        <label 
          htmlFor={inputId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
        
        <input
          id={inputId}
          className={inputVariants({ variant, className })}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={
            [error && errorId, helpText && helpId, success && successId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-required={required}
          {...props}
        />
        
        {helpText && (
          <p id={helpId} className="text-sm text-muted-foreground">
            {helpText}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        
        {success && (
          <p id={successId} className="text-sm text-green-600" role="status">
            {success}
          </p>
        )}
      </div>
    )
  }
)

AccessibleInput.displayName = "AccessibleInput"

export { AccessibleInput, inputVariants }
```

---

## 📊 PHASE 3: ADVANCED REPORTING AND ANALYTICS DASHBOARD (WEEKS 9-11)

### **Week 9: Analytics Infrastructure**

#### **Day 1-3: Real-time Analytics Engine**

**Morning (0-4 hours):**

```typescript
// Real-time analytics tracking
// File: apps/booking/lib/analytics-engine.ts
interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  customDimensions?: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId: string
  tenantId: string
  deviceInfo: {
    type: 'desktop' | 'mobile' | 'tablet'
    os: string
    browser: string
    screenResolution: string
  }
  pageInfo: {
    url: string
    title: string
    referrer?: string
    utmSource?: string
    utmMedium?: string
    utmCampaign?: string
  }
}

export class AnalyticsEngine {
  private static instance: AnalyticsEngine
  private eventQueue: AnalyticsEvent[] = []
  private batchSize = 10
  private flushInterval = 30000 // 30 seconds
  private sessionId: string
  private tenantId: string

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.tenantId = this.getTenantId()
    this.setupBatchFlush()
  }

  static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine()
    }
    return AnalyticsEngine.instance
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getTenantId(): string {
    // Extract tenant from URL path or subdomain
    const path = window.location.pathname
    const pathParts = path.split('/')
    return pathParts.length > 1 ? pathParts[1] : 'default'
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTablet = /iPad|Android(?=.*Tablet)|Tablet/i.test(userAgent)
    
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop'
    if (isTablet) deviceType = 'tablet'
    else if (isMobile) deviceType = 'mobile'

    return {
      type: deviceType,
      os: this.getOS(userAgent),
      browser: this.getBrowser(userAgent),
      screenResolution: `${screen.width}x${screen.height}`
    }
  }

  private getOS(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }

  private getBrowser(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    if (userAgent.includes('Opera')) return 'Opera'
    return 'Unknown'
  }

  track(event: string, customDimensions?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event: 'custom',
      category: customDimensions?.category || 'General',
      action: event,
      label: customDimensions?.label,
      value: customDimensions?.value,
      customDimensions,
      timestamp: new Date(),
      sessionId: this.sessionId,
      tenantId: this.tenantId,
      deviceInfo: this.getDeviceInfo(),
      pageInfo: {
        url: window.location.href,
        title: document.title,
        referrer: document.referrer,
        utmSource: this.getUTMParameter('utm_source'),
        utmMedium: this.getUTMParameter('utm_medium'),
        utmCampaign: this.getUTMParameter('utm_campaign')
      }
    }

    this.eventQueue.push(analyticsEvent)

    // Flush immediately for critical events
    if (customDimensions?.critical) {
      this.flushEvents()
    }
  }

  trackBooking(action: string, details: {
    serviceId?: string
    serviceName?: string
    value?: number
    step?: string
    success?: boolean
    error?: string
  }) {
    this.track('booking', {
      category: 'Booking',
      action,
      label: details.serviceName,
      value: details.value,
      critical: action === 'booking_completed',
      ...details
    })
  }

  trackPageView(pageName: string, pageUrl?: string) {
    this.track('page_view', {
      category: 'Navigation',
      action: 'page_view',
      label: pageName,
      critical: true,
      pageUrl: pageUrl || window.location.href
    })
  }

  trackConversion(funnelStep: string, value?: number) {
    this.track('conversion', {
      category: 'Conversion',
      action: funnelStep,
      value,
      critical: true
    })
  }

  private getUTMParameter(param: string): string | undefined {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param) || undefined
  }

  private setupBatchFlush() {
    setInterval(() => {
      this.flushEvents()
    }, this.flushInterval)
  }

  private async flushEvents() {
    if (this.eventQueue.length === 0) return

    const eventsToSend = this.eventQueue.splice(0, this.batchSize)
    
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: eventsToSend,
          sessionId: this.sessionId,
          tenantId: this.tenantId
        })
      })
    } catch (error) {
      console.error('Failed to send analytics events:', error)
      // Re-queue events for retry
      this.eventQueue.unshift(...eventsToSend)
    }
  }

  // User identification for cross-device tracking
  identify(userId: string, traits?: Record<string, any>) {
    localStorage.setItem('analytics_user_id', userId)
    if (traits) {
      localStorage.setItem('analytics_user_traits', JSON.stringify(traits))
    }
    
    this.track('user_identified', {
      category: 'User',
      action: 'identify',
      critical: true,
      userId,
      ...traits
    })
  }

  // Reset session (call on logout)
  resetSession() {
    this.sessionId = this.generateSessionId()
    localStorage.removeItem('analytics_session_start')
  }
}

// Advanced analytics dashboard component
// File: apps/booking/components/analytics/AnalyticsDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AnalyticsData {
  overview: {
    totalBookings: number
    conversionRate: number
    averageBookingValue: number
    repeatCustomers: number
    bounceRate: number
    pageViews: number
  }
  bookingTrends: Array<{
    date: string
    bookings: number
    revenue: number
    conversions: number
  }>
  topServices: Array<{
    serviceName: string
    bookings: number
    revenue: number
    conversionRate: number
  }>
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
  }
  trafficSources: Array<{
    source: string
    visitors: number
    conversions: number
    conversionRate: number
  }>
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const [refreshInterval, setRefreshInterval] = useState(300000) // 5 minutes

  useEffect(() => {
    fetchAnalyticsData()
    
    // Auto-refresh data
    const interval = setInterval(fetchAnalyticsData, refreshInterval)
    return () => clearInterval(interval)
  }, [dateRange, refreshInterval])

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?range=${dateRange}`)
      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.totalBookings)}</div>
            <p className="text-xs text-green-600 mt-1">+12% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.overview.conversionRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-green-600 mt-1">+2.3% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg. Booking Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.overview.averageBookingValue)}</div>
            <p className="text-xs text-green-600 mt-1">+8% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Repeat Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.repeatCustomers)}</div>
            <p className="text-xs text-blue-600 mt-1">{(data.overview.repeatCustomers / data.overview.totalBookings * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.overview.bounceRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-red-600 mt-1">-1.2% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(data.overview.pageViews)}</div>
            <p className="text-xs text-green-600 mt-1">+15% from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Booking Trends</TabsTrigger>
          <TabsTrigger value="services">Top Services</TabsTrigger>
          <TabsTrigger value="devices">Device Breakdown</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end space-x-2">
                {data.bookingTrends.map((trend, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="bg-blue-600 w-full rounded-t"
                      style={{
                        height: `${(trend.bookings / Math.max(...data.bookingTrends.map(t => t.bookings))) * 200}px`
                      }}
                      title={`${trend.date}: ${trend.bookings} bookings, ${formatCurrency(trend.revenue)} revenue`}
                    />
                    <span className="text-xs mt-2 transform -rotate-45 origin-center">
                      {new Date(trend.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topServices.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{service.serviceName}</h4>
                      <p className="text-sm text-gray-600">
                        {service.bookings} bookings • {formatCurrency(service.revenue)} revenue
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {(service.conversionRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Usage Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Desktop</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${data.deviceBreakdown.desktop}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{data.deviceBreakdown.desktop.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mobile</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${data.deviceBreakdown.mobile}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{data.deviceBreakdown.mobile.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tablet</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${data.deviceBreakdown.tablet}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{data.deviceBreakdown.tablet.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{source.source}</h4>
                      <p className="text-sm text-gray-600">
                        {formatNumber(source.visitors)} visitors
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {source.conversions}
                      </div>
                      <div className="text-sm text-gray-600">
                        {(source.conversionRate * 100).toFixed(1)}% conversion
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
```

---

## 📱 PHASE 4: AUTOMATED REMINDER SYSTEM (WEEKS 10-12)

### **Week 10: Multi-Channel Notification System**

#### **Day 1-3: SMS and Email Automation**

**Morning (0-4 hours):**

```typescript
// Multi-channel notification service
// File: apps/booking/lib/notification-service.ts
interface NotificationTemplate {
  id: string
  name: string
  type: 'email' | 'sms' | 'whatsapp' | 'push'
  trigger: 'booking_confirmed' | 'reminder_24h' | 'reminder_2h' | 'cancellation' | 'reschedule'
  subject?: string
  content: string
  variables: string[]
  isActive: boolean
}

interface NotificationContext {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceName: string
  servicePrice: number
  appointmentDate: string
  appointmentTime: string
  businessName: string
  businessPhone: string
  businessAddress: string
  bookingId: string
}

export class NotificationService {
  private static templates: NotificationTemplate[] = [
    {
      id: 'booking_confirmation_email',
      name: 'Booking Confirmation Email',
      type: 'email',
      trigger: 'booking_confirmed',
      subject: 'Booking Confirmation - {{businessName}}',
      content: `
        <h2>Booking Confirmed!</h2>
        <p>Dear {{customerName}},</p>
        <p>Your appointment has been confirmed with {{businessName}}.</p>
        
        <h3>Appointment Details:</h3>
        <ul>
          <li><strong>Service:</strong> {{serviceName}}</li>
          <li><strong>Date:</strong> {{appointmentDate}}</li>
          <li><strong>Time:</strong> {{appointmentTime}}</li>
          <li><strong>Price:</strong> R{{servicePrice}}</li>
        </ul>
        
        <p><strong>Location:</strong> {{businessAddress}}</p>
        <p><strong>Contact:</strong> {{businessPhone}}</p>
        
        <p>We look forward to seeing you!</p>
        <p>Best regards,<br>{{businessName}} Team</p>
      `,
      variables: ['customerName', 'serviceName', 'appointmentDate', 'appointmentTime', 'servicePrice', 'businessName', 'businessPhone', 'businessAddress'],
      isActive: true
    },
    {
      id: 'reminder_24h_sms',
      name: '24-Hour Reminder SMS',
      type: 'sms',
      trigger: 'reminder_24h',
      content: 'Hi {{customerName}}! Reminder: You have {{serviceName}} tomorrow at {{appointmentTime}} with {{businessName}}. Location: {{businessAddress}}. Questions? Call {{businessPhone}}',
      variables: ['customerName', 'serviceName', 'appointmentTime', 'businessName', 'businessAddress', 'businessPhone'],
      isActive: true
    },
    {
      id: 'reminder_2h_whatsapp',
      name: '2-Hour Reminder WhatsApp',
      type: 'whatsapp',
      trigger: 'reminder_2h',
      content: '🕐 *Appointment Reminder*\n\nHi {{customerName}}!\n\nYour {{serviceName}} appointment is in 2 hours at {{appointmentTime}}.\n\n📍 {{businessAddress}}\n📞 {{businessPhone}}\n\nSee you soon! 😊',
      variables: ['customerName', 'serviceName', 'appointmentTime', 'businessAddress', 'businessPhone'],
      isActive: true
    }
  ]

  static async sendNotification(
    trigger: NotificationTemplate['trigger'],
    context: NotificationContext,
    customTemplate?: Partial<NotificationTemplate>
  ): Promise<{ success: boolean; message: string; messageId?: string }> {
    try {
      // Get applicable templates
      const templates = this.templates.filter(t => t.trigger === trigger && t.isActive)
      
      if (templates.length === 0) {
        return { success: false, message: 'No active templates found for this trigger' }
      }

      const results = []
      
      // Send notifications through all applicable channels
      for (const template of templates) {
        const result = await this.sendTemplateNotification(template, context)
        results.push(result)
      }

      // Log notification attempt
      await this.logNotificationAttempt(trigger, context, results)

      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      return {
        success: failed === 0,
        message: `Sent ${successful} notifications successfully, ${failed} failed`
      }

    } catch (error) {
      console.error('Notification service error:', error)
      return {
        success: false,
        message: `Notification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  private static async sendTemplateNotification(
    template: NotificationTemplate,
    context: NotificationContext
  ): Promise<{ success: boolean; message: string; messageId?: string }> {
    const processedContent = this.processTemplate(template, context)

    switch (template.type) {
      case 'email':
        return await this.sendEmail(processedContent, context)
      case 'sms':
        return await this.sendSMS(processedContent.content, context)
      case 'whatsapp':
        return await this.sendWhatsApp(processedContent.content, context)
      case 'push':
        return await this.sendPushNotification(processedContent.content, context)
      default:
        return { success: false, message: `Unknown notification type: ${template.type}` }
    }
  }

  private static processTemplate(template: NotificationTemplate, context: NotificationContext) {
    let content = template.content
    let subject = template.subject

    // Replace variables in content
    for (const variable of template.variables) {
      const value = context[variable as keyof NotificationContext]
      if (value !== undefined) {
        const regex = new RegExp(`{{${variable}}}`, 'g')
        content = content.replace(regex, String(value))
        if (subject) {
          subject = subject.replace(regex, String(value))
        }
      }
    }

    return { content, subject }
  }

  private static async sendEmail(
    processedContent: { content: string; subject?: string },
    context: NotificationContext
  ): Promise<{ success: boolean; message: string; messageId?: string }> {
    try {
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: context.customerEmail,
          subject: processedContent.subject,
          html: processedContent.content,
          templateData: context
        })
      })

      const result = await response.json()

      return {
        success: response.ok,
        message: response.ok ? 'Email sent successfully' : result.error || 'Email failed',
        messageId: result.messageId
      }

    } catch (error) {
      return {
        success: false,
        message: `Email error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  private static async sendSMS(
    content: string,
    context: NotificationContext
  ): Promise<{ success: boolean; message: string; messageId?: string }> {
    try {
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: context.customerPhone,
          message: content,
          bookingId: context.bookingId
        })
      })

      const result = await response.json()

      return {
        success: response.ok,
        message: response.ok ? 'SMS sent successfully' : result.error || 'SMS failed',
        messageId: result.messageId
      }

    } catch (error) {
      return {
        success: false,
        message: `SMS error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  private static async sendWhatsApp(
    content: string,
    context: NotificationContext
  ): Promise<{ success: boolean; message: string; messageId?: string }> {
    try {
      const response = await fetch('/api/notifications/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: context.customerPhone,
          message: content,
          bookingId: context.bookingId
        })
      })

      const result = await response.json()

      return {
        success: response.ok,
        message: response.ok ? 'WhatsApp message sent successfully' : result.error || 'WhatsApp failed',
        messageId: result.messageId
      }

    } catch (error) {
      return {
        success: false,
        message: `WhatsApp error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  private static async sendPushNotification(
    content: string,
    context: NotificationContext
  ): Promise<{ success: boolean; message: string; messageId?: string }> {
    // Implement push notification logic
    // This would integrate with Firebase Cloud Messaging or similar service
    return {
      success: true,
      message: 'Push notification sent successfully'
    }
  }

  private static async logNotificationAttempt(
    trigger: NotificationTemplate['trigger'],
    context: NotificationContext,
    results: Array<{ success: boolean; message: string; messageId?: string }>
  ): Promise<void> {
    try {
      await fetch('/api/notifications/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger,
          context,
          results,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to log notification attempt:', error)
    }
  }

  // Schedule reminders based on appointment time
  static scheduleReminders(appointmentDate: string, appointmentTime: string, context: NotificationContext): void {
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`)
    const now = new Date()

    // Schedule 24-hour reminder
    const reminder24hTime = new Date(appointmentDateTime.getTime() - (24 * 60 * 60 * 1000))
    if (reminder24hTime > now) {
      this.scheduleNotification('reminder_24h', reminder24hTime, context)
    }

    // Schedule 2-hour reminder
    const reminder2hTime = new Date(appointmentDateTime.getTime() - (2 * 60 * 60 * 1000))
    if (reminder2hTime > now) {
      this.scheduleNotification('reminder_2h', reminder2hTime, context)
    }
  }

  private static scheduleNotification(
    trigger: NotificationTemplate['trigger'],
    scheduledTime: Date,
    context: NotificationContext
  ): void {
    const delay = scheduledTime.getTime() - Date.now()
    
    if (delay > 0) {
      setTimeout(async () => {
        await this.sendNotification(trigger, context)
      }, delay)
    }
  }

  // Template management
  static getTemplates(): NotificationTemplate[] {
    return this.templates
  }

  static updateTemplate(id: string, updates: Partial<NotificationTemplate>): boolean {
    const index = this.templates.findIndex(t => t.id === id)
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates }
      return true
    }
    return false
  }
}
```

**Afternoon (4-8 hours):**

```typescript
// Notification scheduling system
// File: apps/booking/lib/notification-scheduler.ts
import { NotificationService } from './notification-service'

interface ScheduledNotification {
  id: string
  bookingId: string
  trigger: 'reminder_24h' | 'reminder_2h' | 'follow_up'
  scheduledTime: Date
  context: any
  status: 'pending' | 'sent' | 'failed' | 'cancelled'
  attempts: number
  maxAttempts: number
  lastAttempt?: Date
  createdAt: Date
}

export class NotificationScheduler {
  private static scheduledNotifications: Map<string, ScheduledNotification> = new Map()
  private static schedulerInterval: NodeJS.Timeout | null = null

  static startScheduler(): void {
    if (this.schedulerInterval) return

    this.schedulerInterval = setInterval(() => {
      this.processScheduledNotifications()
    }, 60000) // Check every minute

    console.log('Notification scheduler started')
  }

  static stopScheduler(): void {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval)
      this.schedulerInterval = null
      console.log('Notification scheduler stopped')
    }
  }

  static scheduleNotification(
    bookingId: string,
    trigger: ScheduledNotification['trigger'],
    scheduledTime: Date,
    context: any
  ): string {
    const id = `${bookingId}_${trigger}_${Date.now()}`
    
    const scheduledNotification: ScheduledNotification = {
      id,
      bookingId,
      trigger,
      scheduledTime,
      context,
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date()
    }

    this.scheduledNotifications.set(id, scheduledNotification)
    
    // Persist to database
    this.persistScheduledNotification(scheduledNotification)
    
    console.log(`Scheduled ${trigger} notification for booking ${bookingId} at ${scheduledTime}`)
    
    return id
  }

  static cancelNotification(notificationId: string): boolean {
    const notification = this.scheduledNotifications.get(notificationId)
    if (notification && notification.status === 'pending') {
      notification.status = 'cancelled'
      this.scheduledNotifications.set(notificationId, notification)
      
      // Update in database
      this.updateScheduledNotificationStatus(notificationId, 'cancelled')
      
      return true
    }
    return false
  }

  static cancelBookingNotifications(bookingId: string): number {
    let cancelledCount = 0
    
    for (const [id, notification] of this.scheduledNotifications) {
      if (notification.bookingId === bookingId && notification.status === 'pending') {
        notification.status = 'cancelled'
        this.scheduledNotifications.set(id, notification)
        cancelledCount++
      }
    }
    
    if (cancelledCount > 0) {
      this.updateBookingNotificationStatus(bookingId, 'cancelled')
    }
    
    return cancelledCount
  }

  private static async processScheduledNotifications(): Promise<void> {
    const now = new Date()
    const dueNotifications: ScheduledNotification[] = []

    // Find notifications that are due
    for (const notification of this.scheduledNotifications.values()) {
      if (
        notification.status === 'pending' &&
        notification.scheduledTime <= now
      ) {
        dueNotifications.push(notification)
      }
    }

    // Process due notifications
    for (const notification of dueNotifications) {
      await this.processDueNotification(notification)
    }
  }

  private static async processDueNotification(notification: ScheduledNotification): Promise<void> {
    try {
      notification.attempts++
      notification.lastAttempt = new Date()
      
      // Send notification
      const result = await NotificationService.sendNotification(
        notification.trigger,
        notification.context
      )

      if (result.success) {
        notification.status = 'sent'
        console.log(`Successfully sent ${notification.trigger} notification for booking ${notification.bookingId}`)
      } else {
        if (notification.attempts >= notification.maxAttempts) {
          notification.status = 'failed'
          console.error(`Failed to send ${notification.trigger} notification after ${notification.attempts} attempts: ${result.message}`)
        } else {
          // Reschedule for retry in 5 minutes
          notification.scheduledTime = new Date(Date.now() + (5 * 60 * 1000))
          notification.status = 'pending'
          console.log(`Retrying ${notification.trigger} notification in 5 minutes (attempt ${notification.attempts}/${notification.maxAttempts})`)
        }
      }

      // Update in database
      this.updateScheduledNotification(notification)

    } catch (error) {
      console.error(`Error processing notification ${notification.id}:`, error)
      
      if (notification.attempts >= notification.maxAttempts) {
        notification.status = 'failed'
        this.updateScheduledNotificationStatus(notification.id, 'failed')
      }
    }
  }

  // Database persistence methods (would integrate with your actual database)
  private static async persistScheduledNotification(notification: ScheduledNotification): Promise<void> {
    // In a real implementation, this would save to database
    console.log('Persisting scheduled notification:', notification.id)
  }

  private static async updateScheduledNotification(notification: ScheduledNotification): Promise<void> {
    // In a real implementation, this would update the database record
    console.log('Updating scheduled notification:', notification.id, notification.status)
  }

  private static async updateScheduledNotificationStatus(id: string, status: ScheduledNotification['status']): Promise<void> {
    // In a real implementation, this would update the database record
    const notification = this.scheduledNotifications.get(id)
    if (notification) {
      notification.status = status
      this.scheduledNotifications.set(id, notification)
    }
  }

  private static async updateBookingNotificationStatus(bookingId: string, status: ScheduledNotification['status']): Promise<void> {
    // In a real implementation, this would update all notifications for a booking
    console.log(`Updating all notifications for booking ${bookingId} to status: ${status}`)
  }

  // Get scheduled notifications for a booking
  static getBookingNotifications(bookingId: string): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values())
      .filter(n => n.bookingId === bookingId)
  }

  // Get pending notifications count
  static getPendingCount(): number {
    return Array.from(this.scheduledNotifications.values())
      .filter(n => n.status === 'pending').length
  }

  // Get failed notifications for admin review
  static getFailedNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values())
      .filter(n => n.status === 'failed')
  }
}
```

---

## 🧪 PHASE 5: A/B TESTING FRAMEWORK (WEEKS 11-12)

### **Week 11: A/B Testing Infrastructure**

#### **Day 1-3: Testing Framework Implementation**

**Morning (0-4 hours):**

```typescript
// A/B testing framework
// File: apps/booking/lib/ab-testing.ts
interface ABTest {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: ABTestVariant[]
  trafficAllocation: Record<string, number> // percentage allocation per variant
  startDate: Date
  endDate?: Date
  targetMetric: 'conversion_rate' | 'booking_completion' | 'time_on_page' | 'bounce_rate'
  minimumSampleSize: number
  confidenceLevel: number
  statisticalSignificance: number
  createdAt: Date
  updatedAt: Date
}

interface ABTestVariant {
  id: string
  name: string
  description: string
  isControl: boolean
  configuration: Record<string, any> // Variant-specific configuration
}

interface ABTestAssignment {
  testId: string
  variantId: string
  userId: string
  sessionId: string
  assignedAt: Date
}

interface ABTestMetrics {
  testId: string
  variantId: string
  metric: string
  value: number
  sampleSize: number
  timestamp: Date
}

export class ABTestingFramework {
  private static tests: Map<string, ABTest> = new Map()
  private static assignments: Map<string, ABTestAssignment> = new Map()
  private static metrics: ABTestMetrics[] = []

  static createTest(test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>): string {
    const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newTest: ABTest = {
      ...test,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.tests.set(id, newTest)
    this.persistTest(newTest)
    
    console.log(`Created A/B test: ${test.name} (${id})`)
    return id
  }

  static getVariantForUser(testId: string, userId?: string, sessionId?: string): ABTestVariant | null {
    const test = this.tests.get(testId)
    if (!test || test.status !== 'running') {
      return null
    }

    // Check if user already has an assignment
    const assignmentKey = `${testId}_${userId}_${sessionId}`
    const existingAssignment = this.assignments.get(assignmentKey)
    
    if (existingAssignment) {
      return test.variants.find(v => v.id === existingAssignment.variantId) || null
    }

    // Create new assignment based on traffic allocation
    const random = Math.random() * 100
    let cumulative = 0
    let selectedVariant: ABTestVariant | null = null

    for (const [variantId, allocation] of Object.entries(test.trafficAllocation)) {
      cumulative += allocation
      if (random <= cumulative) {
        selectedVariant = test.variants.find(v => v.id === variantId) || null
        break
      }
    }

    // Fallback to control variant
    if (!selectedVariant) {
      selectedVariant = test.variants.find(v => v.isControl) || test.variants[0]
    }

    // Store assignment
    const assignment: ABTestAssignment = {
      testId,
      variantId: selectedVariant.id,
      userId: userId || 'anonymous',
      sessionId: sessionId || this.generateSessionId(),
      assignedAt: new Date()
    }

    this.assignments.set(assignmentKey, assignment)
    this.persistAssignment(assignment)

    // Track assignment for analytics
    this.trackEvent('ab_test_assignment', {
      testId,
      variantId: selectedVariant.id,
      userId: userId,
      sessionId: sessionId
    })

    return selectedVariant
  }

  static trackMetric(
    testId: string,
    variantId: string,
    metric: string,
    value: number,
    userId?: string,
    sessionId?: string
  ): void {
    const metricRecord: ABTestMetrics = {
      testId,
      variantId,
      metric,
      value,
      sampleSize: 1,
      timestamp: new Date()
    }

    this.metrics.push(metricRecord)
    this.persistMetric(metricRecord)

    // Real-time metric tracking
    this.updateTestMetrics(testId)
  }

  static getTestResults(testId: string): ABTestResults {
    const test = this.tests.get(testId)
    if (!test) {
      throw new Error(`Test not found: ${testId}`)
    }

    const variantMetrics = new Map<string, {
      values: number[]
      sampleSize: number
      conversions: number
    }>()

    // Aggregate metrics by variant
    for (const variant of test.variants) {
      const variantData = this.metrics.filter(m => m.testId === testId && m.variantId === variant.id)
      
      const values = variantData.map(m => m.value)
      const conversions = variantData.filter(m => 
        m.metric === test.targetMetric && m.value === 1 // Assuming binary conversion metric
      ).length

      variantMetrics.set(variant.id, {
        values,
        sampleSize: values.length,
        conversions
      })
    }

    // Calculate statistics
    const results = {
      test,
      variants: test.variants.map(variant => {
        const data = variantMetrics.get(variant.id)!
        const conversionRate = data.sampleSize > 0 ? data.conversions / data.sampleSize : 0
        
        return {
          variant,
          sampleSize: data.sampleSize,
          conversions: data.conversions,
          conversionRate,
          averageValue: data.values.length > 0 ? data.values.reduce((a, b) => a + b, 0) / data.values.length : 0,
          confidenceInterval: this.calculateConfidenceInterval(data.values, 0.95)
        }
      }),
      statisticalSignificance: this.calculateStatisticalSignificance(testId),
      recommendations: this.generateRecommendations(testId)
    }

    return results
  }

  private static calculateConfidenceInterval(values: number[], confidenceLevel: number): {
    lower: number
    upper: number
    margin: number
  } {
    if (values.length === 0) {
      return { lower: 0, upper: 0, margin: 0 }
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)
    
    const margin = 1.96 * (stdDev / Math.sqrt(values.length)) // 95% confidence interval
    
    return {
      lower: mean - margin,
      upper: mean + margin,
      margin
    }
  }

  private static calculateStatisticalSignificance(testId: string): {
    isSignificant: boolean
    pValue: number
    effectSize: number
    winner?: string
  } {
    const test = this.tests.get(testId)
    if (!test) {
      return { isSignificant: false, pValue: 1, effectSize: 0 }
    }

    const controlVariant = test.variants.find(v => v.isControl)
    if (!controlVariant) {
      return { isSignificant: false, pValue: 1, effectSize: 0 }
    }

    const controlMetrics = this.metrics.filter(m => m.testId === testId && m.variantId === controlVariant.id)
    const testMetrics = this.metrics.filter(m => m.testId === testId && !test.variants.find(v => v.id === m.variantId)?.isControl)

    if (controlMetrics.length === 0 || testMetrics.length === 0) {
      return { isSignificant: false, pValue: 1, effectSize: 0 }
    }

    // Simplified statistical test (would use proper statistical library in production)
    const controlConversionRate = controlMetrics.filter(m => m.value === 1).length / controlMetrics.length
    const testConversionRate = testMetrics.filter(m => m.value === 1).length / testMetrics.length
    
    const effectSize = testConversionRate - controlConversionRate
    const pooledStandardError = Math.sqrt(
      (controlConversionRate * (1 - controlConversionRate)) / controlMetrics.length +
      (testConversionRate * (1 - testConversionRate)) / testMetrics.length
    )
    
    const zScore = Math.abs(effectSize / pooledStandardError)
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore))) // Two-tailed test
    
    const isSignificant = pValue < (1 - test.confidenceLevel)
    
    let winner: string | undefined
    if (isSignificant && effectSize > 0) {
      winner = test.variants.find(v => !v.isControl)?.id
    } else if (isSignificant && effectSize < 0) {
      winner = controlVariant.id
    }

    return {
      isSignificant,
      pValue,
      effectSize,
      winner
    }
  }

  private static normalCDF(x: number): number {
    // Approximation of the cumulative distribution function of standard normal distribution
    return (1 + this.erf(x / Math.sqrt(2))) / 2
  }

  private static erf(x: number): number {
    // Approximation of error function
    const a1 = 0.254829592
    const a2 = -0.284496736
    const a3 = 1.421413741
    const a4 = -1.453152027
    const a5 = 1.061405429
    const p = 0.3275911

    const sign = x < 0 ? -1 : 1
    x = Math.abs(x)

    const t = 1 / (1 + p * x)
    const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x)

    return sign * y
  }

  private static generateRecommendations(testId: string): string[] {
    const significance = this.calculateStatisticalSignificance(testId)
    const recommendations: string[] = []

    if (!significance.isSignificant) {
      recommendations.push('Test has not reached statistical significance yet. Continue running or increase sample size.')
      recommendations.push('Consider extending the test duration or increasing traffic allocation.')
    } else {
      if (significance.winner) {
        recommendations.push(`Variant ${significance.winner} is the statistically significant winner.`)
        recommendations.push('Consider implementing the winning variant and running follow-up tests.')
      } else {
        recommendations.push('No significant difference found between variants.')
        recommendations.push('Consider testing different hypotheses or variations.')
      }
    }

    if (significance.effectSize < 0.01) {
      recommendations.push('Effect size is very small. Consider testing more dramatic changes.')
    }

    return recommendations
  }

  private static updateTestMetrics(testId: string): void {
    // Update test metrics in real-time
    const test = this.tests.get(testId)
    if (test && test.status === 'running') {
      test.updatedAt = new Date()
      this.tests.set(testId, test)
    }
  }

  // Helper methods
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Persistence methods (would integrate with database)
  private static persistTest(test: ABTest): void {
    console.log('Persisting test:', test.id)
  }

  private static persistAssignment(assignment: ABTestAssignment): void {
    console.log('Persisting assignment:', assignment.testId, assignment.variantId)
  }

  private static persistMetric(metric: ABTestMetrics): void {
    console.log('Persisting metric:', metric.testId, metric.variantId, metric.metric, metric.value)
  }

  private static trackEvent(event: string, data: any): void {
    // Track events for analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, data)
    }
  }

  // Test management methods
  static startTest(testId: string): boolean {
    const test = this.tests.get(testId)
    if (test && test.status === 'draft') {
      test.status = 'running'
      test.startDate = new Date()
      test.updatedAt = new Date()
      this.tests.set(testId, test)
      this.persistTest(test)
      return true
    }
    return false
  }

  static pauseTest(testId: string): boolean {
    const test = this.tests.get(testId)
    if (test && test.status === 'running') {
      test.status = 'paused'
      test.updatedAt = new Date()
      this.tests.set(testId, test)
      this.persistTest(test)
      return true
    }
    return false
  }

  static completeTest(testId: string): boolean {
    const test = this.tests.get(testId)
    if (test && (test.status === 'running' || test.status === 'paused')) {
      test.status = 'completed'
      test.endDate = new Date()
      test.updatedAt = new Date()
      this.tests.set(testId, test)
      this.persistTest(test)
      return true
    }
    return false
  }

  static getTests(): ABTest[] {
    return Array.from(this.tests.values())
  }

  static getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId)
  }
}

interface ABTestResults {
  test: ABTest
  variants: Array<{
    variant: ABTestVariant
    sampleSize: number
    conversions: number
    conversionRate: number
    averageValue: number
    confidenceInterval: {
      lower: number
      upper: number
      margin: number
    }
  }>
  statisticalSignificance: {
    isSignificant: boolean
    pValue: number
    effectSize: number
    winner?: string
  }
  recommendations: string[]
}
```

**Afternoon (4-8 hours):**

```typescript
// A/B Testing React Hook
// File: apps/booking/hooks/useABTest.ts
'use client'

import { useState, useEffect } from 'react'
import { ABTestingFramework, type ABTestVariant } from '@/lib/ab-testing'

interface UseABTestOptions {
  testId: string
  fallback?: Record<string, any>
  trackView?: boolean
  trackConversion?: boolean
}

export function useABTest(options: UseABTestOptions) {
  const [variant, setVariant] = useState<ABTestVariant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const { testId, fallback, trackView = true } = options

    // Get variant for current user
    const userVariant = ABTestingFramework.getVariantForUser(
      testId,
      getUserId(),
      getSessionId()
    )

    if (userVariant) {
      setVariant(userVariant)
      
      // Track test view
      if (trackView) {
        ABTestingFramework.trackMetric(testId, userVariant.id, 'view', 1, getUserId(), getSessionId())
