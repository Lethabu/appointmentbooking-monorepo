"use client"

import { useEffect, useState } from 'react'

export interface AvailabilitySlot {
  start: string
  end: string
}

export default function useAvailability(tenantId: string | null, date: Date | null, serviceId: string | null) {
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!tenantId || !date || !serviceId) return
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      setSlots(null)
      try {
        const dateStr = date!.toISOString().split('T')[0]
        const res = await fetch(`/api/tenant/${tenantId}/availability?date=${dateStr}&serviceId=${serviceId}`)
        if (!res.ok) throw new Error('Failed to fetch availability')
        const data = await res.json() as { slots: AvailabilitySlot[] }
        if (!cancelled) setSlots(data.slots || [])
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [tenantId, date?.toISOString(), serviceId])

  return { slots, loading, error }
}

