"use client"

import { useEffect, useState } from 'react'

interface Slot {
  day: number
  start: string
  end: string
}

export default function SchedulesPage() {
  const [services, setServices] = useState<Array<{ id: string; name: string }>>([])
  const [serviceId, setServiceId] = useState<string>('')
  const [staffNamesText, setStaffNamesText] = useState('')
  const [slots, setSlots] = useState<Slot[]>([{ day: 1, start: '09:00', end: '17:00' }])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  // Replace with tenant ID used across the dashboard
  const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70'

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`/api/public/services?tenantId=${TENANT_ID}`)
        const data = await res.json()
        if (data.services) {
          setServices(data.services.map((s: any) => ({ id: s.id, name: s.name })))
          if (data.services.length > 0) setServiceId(data.services[0].id)
        }
      } catch (err) {
        console.error('Failed to load services', err)
      }
    }
    loadServices()
  }, [])

  const addSlot = () => setSlots((s) => [...s, { day: 1, start: '09:00', end: '17:00' }])
  const removeSlot = (idx: number) => setSlots((s) => s.filter((_, i) => i !== idx))
  const updateSlot = (idx: number, field: keyof Slot, value: any) => {
    setSlots((s) => s.map((slot, i) => (i === idx ? { ...slot, [field]: value } : slot)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const staffNames = staffNamesText.split(',').map((t) => t.trim()).filter(Boolean)
    setLoading(true)
    try {
      const res = await fetch(`/api/tenant/${TENANT_ID}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffNames, schedule: slots.map(s => ({ day: s.day, start: s.start, end: s.end })), serviceId })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMessage(data.message || 'Schedules saved')
      } else {
        setMessage(data.error || 'Failed to save schedules')
      }
    } catch (err) {
      console.error(err)
      setMessage('Failed to save schedules')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <header className="bg-white shadow-sm py-6 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Staff Schedules</h1>
          <p className="text-sm text-gray-500 mt-1">Create or duplicate schedules for staff or general availability.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Staff Names (comma separated)</label>
            <input value={staffNamesText} onChange={e => setStaffNamesText(e.target.value)} placeholder="e.g. Thandi, Aisha" className="mt-2 block w-full p-3 border border-gray-200 rounded-xl" />
            <p className="text-xs text-gray-400 mt-1">Leave empty to apply schedule to general availability.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Service</label>
            <select value={serviceId} onChange={e => setServiceId(e.target.value)} className="mt-2 block w-full p-3 border border-gray-200 rounded-xl">
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Slots</label>
            <div className="space-y-3">
              {slots.map((slot, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <select value={slot.day} onChange={e => updateSlot(idx, 'day', Number(e.target.value))} className="col-span-3 p-2 border rounded-xl">
                    <option value={0}>Sun</option>
                    <option value={1}>Mon</option>
                    <option value={2}>Tue</option>
                    <option value={3}>Wed</option>
                    <option value={4}>Thu</option>
                    <option value={5}>Fri</option>
                    <option value={6}>Sat</option>
                  </select>
                  <input type="time" value={slot.start} onChange={e => updateSlot(idx, 'start', e.target.value)} className="col-span-3 p-2 border rounded-xl" />
                  <input type="time" value={slot.end} onChange={e => updateSlot(idx, 'end', e.target.value)} className="col-span-3 p-2 border rounded-xl" />
                  <div className="col-span-3 flex gap-2">
                    <button type="button" onClick={() => removeSlot(idx)} className="px-3 py-2 bg-red-50 text-red-700 border border-red-100 rounded-lg">Remove</button>
                    {idx === slots.length - 1 && <button type="button" onClick={addSlot} className="px-3 py-2 bg-green-50 text-green-700 border border-green-100 rounded-lg">Add</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Created schedules will be linked to the selected service.</div>
            <div className="flex items-center gap-3">
              {message && <div className="text-sm text-gray-700">{message}</div>}
              <button disabled={loading} type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold disabled:opacity-60">{loading ? 'Saving...' : 'Save Schedules'}</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
