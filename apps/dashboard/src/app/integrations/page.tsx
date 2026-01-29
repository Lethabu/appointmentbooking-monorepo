'use client';

import { useState } from 'react';
import { LayoutGrid, Plus, Globe, Video, CreditCard, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

interface Integration {
    id: string;
    name: string;
    category: string;
    description: string;
    icon: any;
    status: 'installed' | 'available' | 'locked';
    color: string;
}

export default function IntegrationsPage() {
    const [activeCategory, setActiveCategory] = useState('all');

    const integrations: Integration[] = [
        {
            id: 'zoom',
            name: 'Zoom Video',
            category: 'video',
            description: 'Automatically generate Zoom meeting links for remote consultations.',
            icon: Video,
            status: 'installed',
            color: 'blue-500'
        },
        {
            id: 'paystack',
            name: 'Paystack',
            category: 'payments',
            description: 'Accept credit card and instant EFT payments in South Africa.',
            icon: CreditCard,
            status: 'installed',
            color: 'emerald-500'
        },
        {
            id: 'whatsapp',
            name: 'WhatsApp Business',
            category: 'messaging',
            description: 'Send automated reminders and confirmations via WhatsApp.',
            icon: MessageSquare,
            status: 'available',
            color: 'green-500'
        },
        {
            id: 'apple-cal',
            name: 'Apple Calendar',
            category: 'calendars',
            description: 'Two-way sync with iCloud and Apple Calendar via CalDAV.',
            icon: Globe,
            status: 'available',
            color: 'slate-200'
        },
        {
            id: 'nia-ai',
            name: 'Nia AI Agent',
            category: 'ai',
            description: 'Enterprise-grade AI assistant for automated booking handling.',
            icon: ShieldCheck,
            status: 'locked',
            color: 'purple-500'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                        <LayoutGrid className="text-white" /> Integration App Store
                    </h1>
                    <p className="text-slate-400 mt-2">Extend your platform with modular third-party services and intelligent automation.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl hover:bg-slate-700 transition-all font-semibold">
                    <Plus className="w-5 h-5" /> Request Integration
                </button>
            </header>

            <div className="mb-8 flex gap-4 overflow-x-auto pb-2 border-b border-slate-800">
                {['all', 'video', 'payments', 'messaging', 'calendars', 'ai'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations
                    .filter(i => activeCategory === 'all' || i.category === activeCategory)
                    .map(i => (
                        <div key={i.id} className="group bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between hover:border-red-500/50 hover:bg-slate-800/60 transition-all card-hover backdrop-blur-sm">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-4 rounded-xl bg-${i.color}/10 text-${i.color} group-hover:scale-110 transition-transform`}>
                                        <i.icon className="w-8 h-8" />
                                    </div>
                                    {i.status === 'installed' && (
                                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter border border-emerald-500/20">Active</span>
                                    )}
                                    {i.status === 'locked' && (
                                        <span className="bg-purple-500/10 text-purple-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter border border-purple-500/20 italic">Premium</span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{i.name}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{i.description}</p>
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <button className={`text-sm font-bold flex items-center gap-1 self-end ${i.status === 'installed' ? 'text-slate-300' : 'text-red-400 underline decoration-red-400/30 underline-offset-4'}`}>
                                    {i.status === 'installed' ? 'Configure Integration' : 'Enable Integration'} <ExternalLink className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            <div className="mt-16 bg-gradient-to-br from-red-600/10 to-transparent border border-red-500/20 p-8 rounded-3xl text-center">
                <h2 className="text-2xl font-bold mb-2 italic">Building for the Future of South African Business</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    Our App Store architecture allows developers to build custom modules. Securely connect your business logic to the tools you love.
                </p>
            </div>
        </div>
    );
}
