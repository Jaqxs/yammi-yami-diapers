import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "@/components/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />

        {/* Introduction Skeleton */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Skeleton className="h-8 w-80 mx-auto mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </div>

        {/* Tabs Skeleton */}
        <Skeleton className="h-12 w-full mb-8" />

        {/* Tables Skeleton */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-yammy-blue/10">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-yammy-blue/10">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Product Showcase Skeleton */}
        <div className="my-12">
          <Skeleton className="h-8 w-64 mx-auto mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md">
                <Skeleton className="h-64 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3 mb-3" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section Skeleton */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md p-6">
                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                <Skeleton className="h-6 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Skeleton */}
        <div className="bg-yammy-light-blue rounded-xl p-8">
          <Skeleton className="h-8 w-80 mx-auto mb-4" />
          <Skeleton className="h-4 w-3/4 mx-auto mb-6" />
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Skeleton className="h-12 w-48 rounded-lg" />
            <Skeleton className="h-12 w-48 rounded-lg" />
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
