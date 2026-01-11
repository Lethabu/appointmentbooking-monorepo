'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Users, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface UrgencyData {
    message: string;
    type: 'limited_slots' | 'time_sensitive' | 'high_demand' | 'last_chance';
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    timeRemaining?: number; // in minutes
    slotsRemaining?: number;
    peopleViewing?: number;
    lastBooking?: string;
}

interface UrgencyScarcityWidgetProps {
    selectedService?: {
        id: string;
        name: string;
        durationMinutes: number;
    };
    selectedDate?: string;
    selectedTime?: string;
    showLiveActivity?: boolean;
    variant?: 'banner' | 'card' | 'inline' | 'floating';
    autoRotate?: boolean;
    rotationInterval?: number; // in seconds
}

const URGENCY_MESSAGES = {
    limited_slots: {
        low: {
            title: "Good Availability",
            message: "Popular time slots filling up - book now to secure your preferred time.",
            icon: Users,
            color: "blue"
        },
        medium: {
            title: "Limited Availability",
            message: "Only a few spots left for this service today. Book soon to avoid disappointment.",
            icon: AlertTriangle,
            color: "orange"
        },
        high: {
            title: "Almost Booked Out",
            message: "Very few slots remaining today. Don't miss out - book now!",
            icon: AlertTriangle,
            color: "red"
        },
        critical: {
            title: "Last Few Spots",
            message: "Final 2-3 slots remaining today. Book immediately to avoid missing out!",
            icon: Zap,
            color: "red"
        }
    },
    time_sensitive: {
        low: {
            title: "Advance Booking Recommended",
            message: "Book in advance to ensure your preferred date and time.",
            icon: Clock,
            color: "blue"
        },
        medium: {
            title: "Book Today",
            message: "Secure your appointment today - popular times book up quickly.",
            icon: Clock,
            color: "orange"
        },
        high: {
            title: "Limited Time Offer",
            message: "This time slot expires in {time}. Book now to confirm your appointment.",
            icon: Zap,
            color: "red"
        },
        critical: {
            title: "Hurry - Expires Soon",
            message: "Final minutes to book this slot. Don't let it slip away!",
            icon: Zap,
            color: "red"
        }
    },
    high_demand: {
        low: {
            title: "Popular Service",
            message: "This service is in high demand. Consider booking early.",
            icon: TrendingUp,
            color: "blue"
        },
        medium: {
            title: "Trending Now",
            message: "Many clients are booking this service today. Secure your spot!",
            icon: TrendingUp,
            color: "orange"
        },
        high: {
            title: "Booked Non-Stop",
            message: "This service has been booked continuously today. Don't wait!",
            icon: TrendingUp,
            color: "red"
        },
        critical: {
            title: "Fully Booked Soon",
            message: "We're filling up fast! Book immediately to guarantee your appointment.",
            icon: TrendingUp,
            color: "red"
        }
    },
    last_chance: {
        low: {
            title: "Don't Miss Out",
            message: "Last chance to book for this date. Tomorrow's schedule may be different.",
            icon: AlertTriangle,
            color: "orange"
        },
        medium: {
            title: "Final Hours",
            message: "Last few hours to book for today. After this, wait until tomorrow.",
            icon: AlertTriangle,
            color: "red"
        },
        high: {
            title: "Last Call",
            message: "Final booking opportunity for today. Book now or wait until tomorrow.",
            icon: AlertTriangle,
            color: "red"
        },
        critical: {
            title: "Booking Closes Soon",
            message: "Online booking closes in {time}. Don't miss your chance!",
            icon: Zap,
            color: "red"
        }
    }
};

export default function UrgencyScarcityWidget({
    selectedService,
    selectedDate,
    selectedTime,
    showLiveActivity = true,
    variant = 'inline',
    autoRotate = true,
    rotationInterval = 8,
}: UrgencyScarcityWidgetProps) {
    const [currentMessage, setCurrentMessage] = useState<UrgencyData | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [peopleViewing, setPeopleViewing] = useState<number>(0);

    // Simulate dynamic urgency data
    useEffect(() => {
        const generateUrgencyData = (): UrgencyData => {
            const urgencyTypes = Object.keys(URGENCY_MESSAGES) as Array<keyof typeof URGENCY_MESSAGES>;
            const randomType = urgencyTypes[Math.floor(Math.random() * urgencyTypes.length)];

            // Determine urgency level based on context
            let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

            if (selectedService && selectedDate) {
                // Higher urgency if service is selected and date is today or tomorrow
                const today = new Date();
                const selectedDateObj = new Date(selectedDate);
                const daysDiff = Math.ceil((selectedDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24));

                if (daysDiff === 0) urgencyLevel = 'high';
                else if (daysDiff === 1) urgencyLevel = 'medium';
                else if (daysDiff <= 3) urgencyLevel = 'low';
            }

            // Simulate time remaining (for time-sensitive messages)
            const timeLeft = Math.floor(Math.random() * 15) + 5; // 5-20 minutes

            // Simulate people viewing
            const viewers = Math.floor(Math.random() * 8) + 2; // 2-10 people

            return {
                message: URGENCY_MESSAGES[randomType][urgencyLevel].message,
                type: randomType,
                urgencyLevel,
                timeRemaining: randomType === 'time_sensitive' ? timeLeft : undefined,
                slotsRemaining: randomType === 'limited_slots' ? Math.floor(Math.random() * 3) + 1 : undefined,
                peopleViewing: showLiveActivity ? viewers : undefined,
                lastBooking: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
            };
        };

        setCurrentMessage(generateUrgencyData());
    }, [selectedService, selectedDate, selectedTime, showLiveActivity]);

    // Auto-rotate messages
    useEffect(() => {
        if (!autoRotate) return;

        const interval = setInterval(() => {
            const generateNewMessage = (): UrgencyData => {
                const urgencyTypes = Object.keys(URGENCY_MESSAGES) as Array<keyof typeof URGENCY_MESSAGES>;
                const randomType = urgencyTypes[Math.floor(Math.random() * urgencyTypes.length)];
                const urgencyLevels = ['low', 'medium', 'high', 'critical'] as const;
                const randomLevel = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];

                return {
                    message: URGENCY_MESSAGES[randomType][randomLevel].message,
                    type: randomType,
                    urgencyLevel: randomLevel,
                    timeRemaining: randomType === 'time_sensitive' ? Math.floor(Math.random() * 15) + 5 : undefined,
                    slotsRemaining: randomType === 'limited_slots' ? Math.floor(Math.random() * 3) + 1 : undefined,
                    peopleViewing: showLiveActivity ? Math.floor(Math.random() * 8) + 2 : undefined,
                    lastBooking: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                };
            };

            setCurrentMessage(generateNewMessage());
        }, rotationInterval * 1000);

        return () => clearInterval(interval);
    }, [autoRotate, rotationInterval, showLiveActivity]);

    // Countdown timer
    useEffect(() => {
        if (!currentMessage?.timeRemaining) return;

        setTimeRemaining(currentMessage.timeRemaining);

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    // Time expired, generate new message
                    const urgencyTypes = Object.keys(URGENCY_MESSAGES) as Array<keyof typeof URGENCY_MESSAGES>;
                    const randomType = urgencyTypes[Math.floor(Math.random() * urgencyTypes.length)];
                    const urgencyLevels = ['low', 'medium', 'high', 'critical'] as const;
                    const randomLevel = urgencyLevels[Math.floor(Math.random() * urgencyLevels.length)];

                    setCurrentMessage({
                        message: URGENCY_MESSAGES[randomType][randomLevel].message,
                        type: randomType,
                        urgencyLevel: randomLevel,
                        timeRemaining: Math.floor(Math.random() * 15) + 5,
                        slotsRemaining: randomType === 'limited_slots' ? Math.floor(Math.random() * 3) + 1 : undefined,
                        peopleViewing: showLiveActivity ? Math.floor(Math.random() * 8) + 2 : undefined,
                        lastBooking: new Date().toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentMessage?.timeRemaining, showLiveActivity]);

    if (!currentMessage) return null;

    const messageConfig = URGENCY_MESSAGES[currentMessage.type][currentMessage.urgencyLevel];
    const IconComponent = messageConfig.icon;

    const formatTime = (minutes: number) => {
        const mins = Math.floor(minutes);
        const secs = (minutes % 1) * 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const variantClasses = {
        banner: 'w-full bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-2xl mb-6',
        card: 'bg-white border-2 border-red-200 rounded-2xl p-6 shadow-lg',
        inline: 'flex items-center p-4 bg-orange-50 border border-orange-200 rounded-xl',
        floating: 'fixed bottom-4 right-4 z-50 bg-red-500 text-white p-4 rounded-2xl shadow-xl max-w-sm',
    };

    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 border-blue-200',
        orange: 'text-orange-600 bg-orange-50 border-orange-200',
        red: 'text-red-600 bg-red-50 border-red-200',
    };

    const urgencyIntensity = {
        low: 'opacity-75',
        medium: 'opacity-90',
        high: 'opacity-100 ring-2 ring-red-200',
        critical: 'opacity-100 ring-4 ring-red-300 animate-pulse',
    };

    const baseClasses = [
        'transition-all duration-500',
        urgencyIntensity[currentMessage.urgencyLevel],
        variantClasses[variant],
    ].join(' ');

    return (
        <div className={baseClasses} role="alert" aria-live="polite">
            <div className="flex items-start">
                <IconComponent className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">{messageConfig.title}</h4>
                    <p className="text-sm leading-relaxed">
                        {currentMessage.message.replace('{time}', formatTime(timeRemaining))}
                    </p>

                    {/* Dynamic Information */}
                    <div className="mt-3 flex items-center space-x-4 text-xs">
                        {currentMessage.slotsRemaining && (
                            <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                <span>{currentMessage.slotsRemaining} slots left</span>
                            </div>
                        )}

                        {currentMessage.timeRemaining && (
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{formatTime(timeRemaining)} left</span>
                            </div>
                        )}

                        {currentMessage.peopleViewing && (
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{currentMessage.peopleViewing} people viewing</span>
                            </div>
                        )}

                        {currentMessage.lastBooking && (
                            <div className="text-gray-500">
                                Last booking: {currentMessage.lastBooking}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Close button for floating variant */}
            {variant === 'floating' && (
                <button
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Close urgency notification"
                >
                    ×
                </button>
            )}
        </div>
    );
}