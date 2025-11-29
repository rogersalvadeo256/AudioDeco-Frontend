import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return <DefaultErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

const DefaultErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-stone-300 p-8">
            <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 border-2 border-red-600 flex items-center justify-center rotate-45">
                    <div className="w-8 h-8 text-red-600 -rotate-45 font-bold text-xl">!</div>
                </div>
                <h2 className="text-2xl font-serif text-red-600 mb-4">Something went wrong</h2>
                <p className="text-stone-500 mb-6">
                    An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                </p>
                {error && (
                    <details className="text-left text-stone-500 text-sm">
                        <summary className="cursor-pointer mb-2">Error details</summary>
                        <pre className="bg-black/10 p-2 rounded text-xs overflow-auto text-stone-500">
                            {error.message}
                        </pre>
                    </details>
                )}
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-red-900 border border-red-600 text-red-100 uppercase tracking-widest text-xs hover:bg-opacity-80 transition-all"
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
};

const ErrorBoundary: React.FC<ErrorBoundaryProps> = (props) => {
    return <ErrorBoundaryClass {...props} />;
};

export default ErrorBoundary;