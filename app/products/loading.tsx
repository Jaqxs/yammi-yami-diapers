import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "@/components/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mx-auto mb-8" />

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-10" />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Skeleton className="h-10 w-36" />
          </div>
        </div>

        {/* Category Tabs */}
        <Skeleton className="h-12 w-full mb-8" />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <Skeleton className="h-64 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/4 mb-4" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
