
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CompanySkeleton() {
    return (
        <Card className="border border-gray-200 bg-white rounded-2xl">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Logo skeleton */}
                        <div className="w-12 h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
                        <div className="flex-1">
                            {/* Company name skeleton */}
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
                            {/* Description skeleton */}
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-4">
                    {/* Role skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        <div className="h-5 bg-gray-200 rounded-full animate-pulse w-20"></div>
                    </div>

                    {/* Members skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-14"></div>
                        <div className="flex items-center space-x-1">
                            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-6"></div>
                        </div>
                    </div>

                    {/* Last access skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                        <div className="flex items-center space-x-1">
                            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                        </div>
                    </div>

                    {/* Button skeleton */}
                    <div className="pt-2">
                        <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-full"></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function CompanyGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <CompanySkeleton key={index} />
            ))}
        </div>
    )
}
