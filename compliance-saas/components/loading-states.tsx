import React from 'react';

export const CardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

export const ComplianceScoreSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/6"></div>
    </div>
    <div className="h-2.5 bg-gray-200 rounded w-full"></div>
  </div>
);

export const RequirementsSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);

export const NotificationsSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {[1, 2].map((i) => (
      <div key={i} className="p-3 bg-gray-50 rounded-lg">
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-64 bg-gray-200 rounded"></div>
        <div className="flex space-x-4">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-2.5 w-full bg-gray-200 rounded-full"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-8 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
