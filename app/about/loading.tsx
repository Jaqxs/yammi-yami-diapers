import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "@/components/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mx-auto mb-12" />

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <Skeleton className="h-10 w-48 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>

        {/* Our Values Section */}
        <div className="mb-16">
          <Skeleton className="h-10 w-48 mx-auto mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-full border rounded-lg overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-24 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locations Section */}
        <div className="mb-16">
          <Skeleton className="h-10 w-48 mx-auto mb-10" />
          <div className="grid md:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="p-6">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-48 mb-4" />
                  <Skeleton className="h-[200px] w-full rounded-md mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <Skeleton className="h-10 w-48 mx-auto mb-10" />
          <div className="max-w-md mx-auto">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
