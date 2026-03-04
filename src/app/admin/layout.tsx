'use client';

import React from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
            {children}
        </div>
    );
}
