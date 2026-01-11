'use client';

import { useState, useEffect } from 'react';
import StrategicIntelligenceDashboard from '../../components/StrategicIntelligenceDashboard';

export default function StrategicIntelligencePage() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [initializationStatus, setInitializationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize the competitive intelligence system
        const initializeSystem = async () => {
            try {
                setInitializationStatus('loading');

                // Call the initialization API
                const response = await fetch('/api/competitive-intelligence?action=initialize', {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`Initialization failed: ${response.statusText}`);
                }

                const result = await response.json();

                if (result.success) {
                    setIsInitialized(true);
                    setInitializationStatus('success');
                } else {
                    throw new Error(result.message || 'Unknown initialization error');
                }
            } catch (err) {
                console.error('Failed to initialize competitive intelligence system:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                setInitializationStatus('error');
            }
        };

        initializeSystem();
    }, []);

    if (initializationStatus === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-white mb-2">Initializing Strategic Intelligence System</h2>
                    <p className="text-slate-400">Setting up competitive analysis and market monitoring...</p>
                </div>
            </div>
        );
    }

    if (initializationStatus === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-white mb-2">Initialization Failed</h2>
                    <p className="text-slate-400 mb-4">
                        Unable to initialize the competitive intelligence system.
                    </p>
                    <p className="text-red-400 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                        Retry Initialization
                    </button>
                </div>
            </div>
        );
    }

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🧠</div>
                    <h2 className="text-xl font-semibold text-white mb-2">Strategic Intelligence System</h2>
                    <p className="text-slate-400">Ready to initialize competitive analysis and market insights.</p>
                </div>
            </div>
        );
    }

    return <StrategicIntelligenceDashboard />;
}