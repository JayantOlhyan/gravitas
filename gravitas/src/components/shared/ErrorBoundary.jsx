import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex-1 w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col items-center justify-center p-6 mt-4 md:mt-0 relative z-10">
                    <div className="bg-[rgba(255,59,48,0.1)] border border-[var(--accent-red)] rounded-xl p-8 max-w-md w-full flex flex-col items-center text-center backdrop-blur-md">
                        <AlertCircle className="w-16 h-16 text-[var(--accent-red)] mb-4" />
                        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">Systems Failure Detected</h2>
                        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-6">
                            A critical telemetry rendering error occurred within this module. The interface has been halted to prevent cascading failures.
                        </p>

                        <div className="bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)] w-full rounded p-3 mb-6 overflow-x-auto text-left">
                            <code className="text-[10px] text-[var(--accent-red)] block whitespace-pre-wrap font-mono">
                                {this.state.error && this.state.error.toString()}
                            </code>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-transparent border border-[var(--text-muted)] text-[var(--text-primary)] hover:bg-[var(--text-muted)] hover:text-white px-6 py-2 rounded font-bold text-[11px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Restart Interface
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
