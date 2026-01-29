'use client';

import { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, User as UserIcon } from 'lucide-react';

export default function OverridesPage() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [isWorking, setIsWorking] = useState(true);
    const [employeeId, setEmployeeId] = useState('emp-123'); // Demo
    const [loading, setLoading] = useState(false);

    // Mock Tenant ID
    const TENANT_ID = 'ccb12b4d-ade6-467d-a614-7c9d198ddc70';

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/availability/overrides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tenantId: TENANT_ID,
                    employeeId,
                    date,
                    startTime: isWorking ? startTime : null,
                    endTime: isWorking ? endTime : null,
                    isWorking
                })
            });
            if (res.ok) {
                alert('Override saved successfully');
            }
        } catch (err) {
            console.error('Failed to save override');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
            <header className="mb-12">
                <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    <Calendar className="text-white" /> Availability Overrides
                </h1>
                <p className="text-slate-400 mt-2">Adjust your working hours for specific dates without changing your weekly schedule.</p>
            </header>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Creation Form */}
                <form onSubmit={handleSave} className="md:col-span-1 bg-slate-800/50 border border-slate-700 p-6 rounded-2xl space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-red-500" /> New Override</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Employee</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                <select
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-red-500/50"
                                    value={employeeId}
                                    onChange={e => setEmployeeId(e.target.value)}
                                >
                                    <option value="emp-123">InStyle Stylist A</option>
                                    <option value="emp-456">InStyle Stylist B</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                            <input
                                type="date"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500/50"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="isWorking"
                                checked={isWorking}
                                onChange={e => setIsWorking(e.target.checked)}
                                className="w-5 h-5 accent-red-500"
                            />
                            <label htmlFor="isWorking" className="text-sm font-medium text-slate-300 pointer-events-none">Working on this day</label>
                        </div>

                        {isWorking && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1 leading-none">Start</label>
                                    <div className="relative mt-2">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input
                                            type="time"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-2 py-2 text-sm"
                                            value={startTime}
                                            onChange={e => setStartTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1 leading-none">End</label>
                                    <div className="relative mt-2">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                                        <input
                                            type="time"
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-2 py-2 text-sm"
                                            value={endTime}
                                            onChange={e => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Override'}
                    </button>
                </form>

                {/* List of Overrides */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">Upcoming Overrides</h2>

                    <div className="space-y-3">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-slate-800/30 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:bg-slate-700/20 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-900/20 text-red-500 p-3 rounded-lg">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-200">Feb 14, 2026 (Valentine's Day)</p>
                                        <p className="text-sm text-slate-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {i === 1 ? 'Working: 08:00 - 18:00 (Extended)' : 'Not Working'}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-red-400 p-2 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-slate-600 text-sm italic pt-4">Showing overrides for the next 30 days.</p>
                </div>
            </div>
        </div>
    );
}
