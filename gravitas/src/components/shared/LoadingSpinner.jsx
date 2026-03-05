import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading...', fullScreen = false }) {
    const content = (
        <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-orange)]" />
            <span className="text-sm font-medium text-[var(--text-muted-light)] tracking-widest uppercase">
                {text}
            </span>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)]">
                {content}
            </div>
        );
    }

    return (
        <div className="w-full h-full min-h-[150px] flex items-center justify-center">
            {content}
        </div>
    );
}
