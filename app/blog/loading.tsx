import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "@/components/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mx-auto mb-12" />

        {/* Featured Posts Skeleton */}
        <div className="mb-16">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between mb-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="md:col-span-2">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg border overflow-hidden">
                  <div className="md:flex">
                    <Skeleton className="h-64 md:h-auto md:w-1/3" />
                    <div className="md:w-2/3 p-6">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-9 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div>
            <div className="bg-white rounded-lg border p-6 mb-8">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-grow" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6 mb-8">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-full" />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
