'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  useEffect(() => {
    router.push('/instylehairboutique')
  }, [router])
  return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Redirecting to store...
    </div>
  )
}