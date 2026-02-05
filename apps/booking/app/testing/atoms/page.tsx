'use client';

import { BookingWidget } from '@repo/atoms';
import React from 'react';

export default function AtomsDemoPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                    Atomic UI Components Demo
                </h1>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-lg leading-6 font-medium text-gray-900">
                            BookingWidget Atom
                        </h2>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            A reusable, embeddable booking component from <code>@repo/atoms</code>.
                        </p>
                    </div>
                    <div className="border-t border-gray-200 p-8 flex justify-center bg-gray-100">
                        <BookingWidget
                            tenantId="instylehairboutique"
                            className="max-w-md w-full"
                            onSuccess={(id) => alert(`Successfully booked! ID: ${id}`)}
                        />
                    </div>
                </div>

                <div className="text-sm text-gray-500 italic">
                    Note: This page is for development and testing of atomic components.
                </div>
            </div>
        </div>
    );
}

export const runtime = 'edge';
