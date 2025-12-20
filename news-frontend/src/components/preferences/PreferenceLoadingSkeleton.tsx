interface PreferenceLoadingSkeletonProps {
  count?: number;
}

export function PreferenceLoadingSkeleton({ count = 3 }: PreferenceLoadingSkeletonProps) {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
}
