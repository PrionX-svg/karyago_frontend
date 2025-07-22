import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ExcelImportSkeleton = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="container mx-auto px-4 py-8 flex-1">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="space-y-6">
                        {/* Template Download Skeleton */}
                        <Card className="border-0 shadow-lg">
                            <CardContent className="px-6 py-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <Skeleton className="h-5 w-36 mb-2" />
                                        <Skeleton className="h-4 w-64" />
                                    </div>
                                    <div className="ml-4">
                                        <Skeleton className="h-10 w-40" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* File Upload Skeleton */}
                        <Card className="border-0 shadow-xl backdrop-blur-sm">
                            <CardHeader>
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-4 w-72" />
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <div className="space-y-4">
                                        <div className="flex justify-center">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-6 w-48 mx-auto mb-2" />
                                            <Skeleton className="h-4 w-56 mx-auto" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-10 w-28 mx-auto" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons Skeleton */}
                        <div className="flex justify-between pt-6">
                            <Skeleton className="h-10 w-20" />
                            <Skeleton className="h-10 w-40" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExcelImportSkeleton;