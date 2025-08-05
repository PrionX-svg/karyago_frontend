import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSettingsSkeleton() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-background pb-3">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-xl" />
                        <div>
                            <Skeleton className="h-6 w-40 mb-2" />
                            <Skeleton className="h-4 w-72" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-32 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="pt-3 space-y-6">
                {/* 🔶 Card Oranye: Avatar + Info + PTO */}
                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-xl shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            {/* Avatar */}
                            <Skeleton className="w-24 h-24 rounded-full" />

                            {/* Info */}
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>

                            {/* PTO */}
                            <Skeleton className="h-16 w-40 rounded-lg" />
                        </div>
                    </CardContent>
                </Card>

                {/* 🔳 Card Putih: Semua Field */}
                <Card className="bg-white dark:bg-card border border-gray-200 dark:border-stone-700 rounded-xl shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div className="space-y-2" key={i}>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
