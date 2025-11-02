import { Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function CompanySkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-[#0e0e0e] dark:via-[#111111] dark:to-[#1a1a1a] relative overflow-hidden transition-colors duration-300">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Soft gradient blobs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 dark:from-orange-500/10 dark:to-amber-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-yellow-200/30 to-orange-200/30 dark:from-yellow-500/10 dark:to-orange-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-100/20 to-orange-100/20 dark:from-amber-400/5 dark:to-orange-400/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-lg mx-auto">
                    {/* Header Skeleton */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mb-4 shadow-lg">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>

                        {/* Loading title */}
                        <div className="mb-2">
                            <Skeleton className="h-7 w-48 mx-auto dark:bg-gray-700/70" />
                        </div>

                        {/* Loading subtitle */}
                        <Skeleton className="h-5 w-40 mx-auto dark:bg-gray-700/70" />
                    </div>

                    {/* Company Selection Skeleton */}
                    <div className="space-y-3">
                        {[1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className="w-full p-4 rounded-xl bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/60 transition-all duration-300"
                                style={{
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {/* Company logo skeleton */}
                                        <Skeleton className="w-14 h-14 rounded-xl dark:bg-gray-700/70" />

                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32 dark:bg-gray-700/70" />
                                            <Skeleton className="h-3 w-20 dark:bg-gray-700/70" />
                                        </div>
                                    </div>

                                    {/* Arrow skeleton */}
                                    <Skeleton className="w-5 h-5 rounded dark:bg-gray-700/70" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer skeleton */}
                    <div className="text-center mt-8">
                        <div className="flex items-center justify-center gap-2">
                            <Skeleton className="w-4 h-4 rounded dark:bg-gray-700/70" />
                            <Skeleton className="h-4 w-28 dark:bg-gray-700/70" />
                        </div>
                    </div>

                    {/* Loading indicator */}
                    <div className="flex items-center justify-center mt-6">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
