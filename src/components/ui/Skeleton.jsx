// Shimmer loading skeleton for premium loading states
export default function Skeleton({ className = '', variant = 'rect', count = 1 }) {
  const baseClasses = {
    rect: 'h-4 w-full',
    circle: 'h-12 w-12 !rounded-full',
    card: 'h-32 w-full',
    text: 'h-3 w-3/4',
    avatar: 'h-10 w-10 !rounded-full',
    button: 'h-10 w-24',
  };

  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`skeleton ${baseClasses[variant]} ${className}`} />
      ))}
    </div>
  );
}

// Transaction skeleton
export function TransactionSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
          <div className="skeleton h-11 w-11 !rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-32" />
            <div className="skeleton h-3 w-20" />
          </div>
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="premium-card p-6 animate-pulse space-y-4">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-8 w-32" />
      <div className="skeleton h-3 w-full" />
    </div>
  );
}
