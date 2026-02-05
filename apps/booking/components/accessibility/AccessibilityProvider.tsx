'use client';

import { Eye, EyeOff, Keyboard, Volume2 } from 'lucide-react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    keyboardNavigation: boolean;
    screenReader: boolean;
    focusIndicator: boolean;
}

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
    announceToScreenReader: (message: string) => void;
    trapFocus: (element: HTMLElement) => void;
    releaseFocus: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};

interface AccessibilityProviderProps {
    children: React.ReactNode;
}

export default function AccessibilityProvider({ children }: AccessibilityProviderProps) {
    const [settings, setSettings] = useState<AccessibilitySettings>({
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        keyboardNavigation: false,
        screenReader: false,
        focusIndicator: true,
    });

    const [focusTrap, setFocusTrap] = useState<HTMLElement | null>(null);

    // Load settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem('accessibility-settings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (error) {
                console.error('Error loading accessibility settings:', error);
            }
        }
    }, []);

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('accessibility-settings', JSON.stringify(settings));

        // Apply settings to document
        const root = document.documentElement;

        if (settings.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        if (settings.largeText) {
            root.classList.add('large-text');
        } else {
            root.classList.remove('large-text');
        }

        if (settings.reducedMotion) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }
    }, [settings]);

    const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const announceToScreenReader = (message: string) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };

    const trapFocus = (element: HTMLElement) => {
        setFocusTrap(element);
    };

    const releaseFocus = () => {
        setFocusTrap(null);
    };

    const contextValue: AccessibilityContextType = {
        settings,
        updateSetting,
        announceToScreenReader,
        trapFocus,
        releaseFocus,
    };

    return (
        <AccessibilityContext.Provider value={contextValue}>
            {children}
        </AccessibilityContext.Provider>
    );
}

// Accessibility Control Panel Component
export function AccessibilityControls() {
    const { settings, updateSetting } = useAccessibility();

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-80">
            <div className="flex items-center mb-4">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Accessibility Options</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="high-contrast" className="text-sm text-gray-700">
                        High Contrast
                    </label>
                    <input
                        id="high-contrast"
                        type="checkbox"
                        checked={settings.highContrast}
                        onChange={(e) => updateSetting('highContrast', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label htmlFor="large-text" className="text-sm text-gray-700">
                        Large Text
                    </label>
                    <input
                        id="large-text"
                        type="checkbox"
                        checked={settings.largeText}
                        onChange={(e) => updateSetting('largeText', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label htmlFor="reduced-motion" className="text-sm text-gray-700">
                        Reduce Motion
                    </label>
                    <input
                        id="reduced-motion"
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label htmlFor="enhanced-focus" className="text-sm text-gray-700">
                        Enhanced Focus
                    </label>
                    <input
                        id="enhanced-focus"
                        type="checkbox"
                        checked={settings.focusIndicator}
                        onChange={(e) => updateSetting('focusIndicator', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}

// Skip Link Component
export function SkipLinks() {
    return (
        <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-0 focus-within:left-0 focus-within:z-50 focus-within:bg-blue-600 focus-within:text-white focus-within:p-4">
            <a href="#main-content" className="block focus:outline-none focus:ring-2 focus:ring-white">
                Skip to main content
            </a>
            <a href="#booking-form" className="block focus:outline-none focus:ring-2 focus:ring-white mt-2">
                Skip to booking form
            </a>
        </div>
    );
}

// Keyboard Navigation Helper
export function useKeyboardNavigation() {
    const handleKeyPress = (event: KeyboardEvent, callback: () => void) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            callback();
        }
    };

    const handleArrowKey = (
        event: KeyboardEvent,
        items: HTMLElement[],
        currentIndex: number,
        setCurrentIndex: (index: number) => void
    ) => {
        event.preventDefault();

        let newIndex = currentIndex;

        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                newIndex = (currentIndex + 1) % items.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = items.length - 1;
                break;
        }

        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
            items[newIndex].focus();
        }
    };

    return { handleKeyPress, handleArrowKey };
}