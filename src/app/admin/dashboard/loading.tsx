import Skeleton from "@/components/ui/Skeleton"

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <Skeleton className="h-4 w-32 mb-4" />
                            <Skeleton className="h-8 w-20 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex gap-4 items-center">
                                <Skeleton className="h-12 flex-1" />
                                <Skeleton className="h-12 w-32" />
                                <Skeleton className="h-12 w-24" />
                                <Skeleton className="h-12 w-40" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
