'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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