'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { resolveTenantByHost } from '@repo/services'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const host = typeof window !== 'undefined' ? window.location.hostname : undefined
    const tenant = resolveTenantByHost(host)
    router.replace(tenant.route)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center text-gray-500">
      Redirecting to your experience...
    </div>
  )
}

