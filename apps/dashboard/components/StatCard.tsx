'use client'

interface StatCardProps {
    title: string
    value: string | number
    icon: string
    trend?: {
        value: number
        isPositive: boolean
    }
    color?: 'primary' | 'success' | 'warning' | 'danger'
}

export default function StatCard({ title, value, icon, trend, color = 'primary' }: StatCardProps) {
    const colorClasses = {
        primary: 'from-primary to-primary-dark',
        success: 'from-green-500 to-green-700',
        warning: 'from-yellow-500 to-yellow-700',
        danger: 'from-red-500 to-red-700',
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 card-hover animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <div className={`text-4xl bg-gradient-to-br ${colorClasses[color]} bg-clip-text text-transparent`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{trend.isPositive ? '↑' : '↓'}</span>
                        <span className="ml-1">{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    )
}
