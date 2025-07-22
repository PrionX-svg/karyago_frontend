import React from 'react';

const BranchSetupSkeletonWithShimmer = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 0px,
            #e0e0e0 40px,
            #f0f0f0 80px
          );
          background-size: 200px;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

            <main className="flex-1">
                <div className="flex-1 flex flex-col lg:flex-row items-start px-8 py-8 gap-4 sm:gap-16 max-w-7xl mx-auto w-full">
                    {/* Sidebar Skeleton */}
                    <div className="lg:w-80 space-y-6 py-4">
                        {/* Progress Card Skeleton */}
                        <div className="border border-gray-200 bg-white rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 shimmer rounded-lg"></div>
                                <div className="flex-1">
                                    <div className="h-5 shimmer rounded w-24 mb-2"></div>
                                    <div className="h-4 shimmer rounded w-16"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 shimmer rounded w-full"></div>
                                <div className="h-4 shimmer rounded w-3/4"></div>
                                <div className="bg-gray-100 p-3 rounded-lg border">
                                    <div className="flex items-start gap-2">
                                        <div className="w-4 h-4 shimmer rounded mt-0.5"></div>
                                        <div className="flex-1">
                                            <div className="h-4 shimmer rounded w-full"></div>
                                            <div className="h-4 shimmer rounded w-2/3 mt-1"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Guide Card Skeleton */}
                        <div className="border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-5 h-5 shimmer rounded"></div>
                                <div className="h-5 shimmer rounded w-20"></div>
                            </div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-2 h-2 shimmer rounded-full mt-2 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="h-4 shimmer rounded w-full"></div>
                                            <div className="h-4 shimmer rounded w-3/4 mt-1"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <section className="flex-1">
                        <div className="max-w-2xl mx-auto p-4 lg:mx-0">
                            {/* Header Skeleton */}
                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="h-8 shimmer rounded w-48 mb-2"></div>
                                        <div className="h-4 shimmer rounded w-64"></div>
                                    </div>
                                    <div className="w-40 h-10 shimmer rounded"></div>
                                </div>
                            </div>

                            {/* Empty State Skeleton */}
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center bg-gray-50 mb-10">
                                <div className="w-16 h-16 mx-auto mb-6 shimmer rounded-full"></div>
                                <div className="h-5 shimmer rounded w-32 mx-auto mb-2"></div>
                                <div className="h-4 shimmer rounded w-48 mx-auto"></div>
                            </div>

                            {/* Branch List Skeleton */}
                            <div className="space-y-4 mb-8">
                                {[1, 2].map((i) => (
                                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-start shadow-sm">
                                        <div className="flex-1">
                                            <div className="h-5 shimmer rounded w-32 mb-2"></div>
                                            <div className="h-4 shimmer rounded w-full mb-1"></div>
                                            <div className="h-4 shimmer rounded w-3/4 mb-1"></div>
                                            <div className="h-4 shimmer rounded w-48"></div>
                                        </div>
                                        <div className="w-8 h-8 shimmer rounded ml-4"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Navigation Skeleton */}
                            <div className="flex justify-between items-center mt-8 lg:mt-12">
                                <div></div>
                                <div className="w-32 h-10 shimmer rounded"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer Skeleton */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 shimmer rounded"></div>
                            <div className="h-4 shimmer rounded w-24"></div>
                        </div>
                        <div className="flex gap-6">
                            <div className="h-4 shimmer rounded w-16"></div>
                            <div className="h-4 shimmer rounded w-20"></div>
                            <div className="h-4 shimmer rounded w-18"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchSetupSkeletonWithShimmer;