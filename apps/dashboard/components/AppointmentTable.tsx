'use client'

interface Appointment {
    id: string
    scheduled_time: string
    status: string
    created_at: number
    [key: string]: any
}

interface AppointmentTableProps {
    appointments: Appointment[]
}

export default function AppointmentTable({ appointments }: AppointmentTableProps) {
    const formatDate = (timestamp: number | string) => {
        const date = typeof timestamp === 'number' ? new Date(timestamp * 1000) : new Date(timestamp)
        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            confirmed: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
        }
        return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
    }

    if (appointments.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Appointments</h2>
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-500 text-lg">No appointments yet</p>
                    <p className="text-gray-400 text-sm mt-2">When customers book, they'll appear here</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Appointments</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                            <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{appointment.id.substring(0, 8)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(appointment.scheduled_time || appointment.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {appointment.service_id || 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
