export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Progress Dots - Using primary color */}
        <div className="flex space-x-3">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-md"></div>
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-md"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-3 h-3 bg-primary rounded-full animate-bounce shadow-md"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>

        {/* Subtle border accent */}
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full"></div>
      </div>
    </div>
  );
}
