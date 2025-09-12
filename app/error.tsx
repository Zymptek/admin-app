'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Error Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-destructive/20 animate-pulse"></div>
        </div>

        {/* Error Text */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold text-destructive">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Please try again.
          </p>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-muted/50 p-4 rounded-lg max-w-md">
            <p className="text-xs text-muted-foreground mb-2">Error Details:</p>
            <p className="text-xs font-mono text-destructive break-all">
              {error.message || 'Unknown error'}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-1">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Retry Button */}
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          Try Again
        </button>

        {/* Subtle border accent */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-destructive/30 to-transparent rounded-full"></div>
      </div>
    </div>
  );
}
