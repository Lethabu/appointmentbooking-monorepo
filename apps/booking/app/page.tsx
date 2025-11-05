import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to tenant-specific booking or dashboard
  redirect('/instylehairboutique')
}