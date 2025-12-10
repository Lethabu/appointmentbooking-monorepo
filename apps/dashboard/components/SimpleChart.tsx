'use client'

interface ChartBarProps {
    label: string
    value: number
    maxValue: number
    color?: string
}

function ChartBar({ label, value, maxValue, color = 'bg-primary' }: ChartBarProps) {
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">{label}</span>
                <span className="text-gray-900 font-bold">{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    )
}

interface SimpleChartProps {
    title: string
    data: Array<{ label: string; value: number; color?: string }>
}

export default function SimpleChart({ title, data }: SimpleChartProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1)

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
            <div className="space-y-4">
                {data.map((item, index) => (
                    <ChartBar
                        key={index}
                        label={item.label}
                        value={item.value}
                        maxValue={maxValue}
                        color={item.color}
                    />
                ))}
            </div>
        </div>
    )
}
