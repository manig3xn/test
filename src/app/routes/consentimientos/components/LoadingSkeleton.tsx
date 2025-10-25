export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
        <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-12 flex-1 animate-pulse rounded-md bg-muted" />
            <div className="h-12 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-12 w-24 animate-pulse rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
