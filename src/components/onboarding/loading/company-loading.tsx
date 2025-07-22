import { Skeleton } from "@/components/ui/skeleton";

export default function CompanySkeleton() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col lg:flex-row items-start px-8 py-8 gap-4 sm:gap-16 max-w-7xl mx-auto w-full animate-pulse">
                {/* Sidebar Skeleton */}
                <div className="lg:w-80 space-y-6 py-4">
                    <div className="bg-white/60 border border-orange-200 rounded-lg p-6 space-y-4">
                        <div className="flex gap-3 items-center">
                            <Skeleton className="w-8 h-8 rounded-lg bg-orange-200" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32 bg-gray-300" />
                                <Skeleton className="h-3 w-24 bg-gray-200" />
                            </div>
                        </div>
                        <Skeleton className="h-3 w-full bg-gray-200" />
                        <Skeleton className="h-2 w-full bg-green-300" />
                        <Skeleton className="h-4 w-3/4 bg-gray-200" />
                    </div>

                    <div className="bg-orange-50 rounded-lg border border-amber-200 p-6 space-y-3">
                        <Skeleton className="h-4 w-24 bg-amber-300" />
                        <Skeleton className="h-3 w-full bg-amber-200" />
                        <Skeleton className="h-3 w-5/6 bg-amber-200" />
                        <Skeleton className="h-3 w-4/6 bg-amber-200" />
                    </div>
                </div>

                {/* Form Skeleton */}
                <div className="flex-1 space-y-6 max-w-2xl mx-auto p-4 lg:mx-0">
                    <Skeleton className="h-6 w-64 bg-gray-300" />
                    <Skeleton className="h-4 w-3/4 bg-gray-200" />

                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full bg-gray-200 rounded-md" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            <Skeleton className="h-12 w-full bg-gray-200 rounded-md" />
                            <Skeleton className="h-12 w-full bg-gray-200 rounded-md" />
                        </div>

                        <Skeleton className="h-12 w-full bg-gray-200 rounded-md" />
                        <Skeleton className="h-24 w-full bg-gray-200 rounded-md" />
                    </div>

                    <div className="flex justify-end">
                        <Skeleton className="h-10 w-32 bg-orange-300 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
