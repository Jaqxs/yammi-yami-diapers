import { Skeleton } from "@/components/ui/skeleton"
import { PageWrapper } from "@/components/page-wrapper"

export default function Loading() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-64 mx-auto mb-12" />

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <div>
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <Skeleton className="h-8 w-48 mb-3" />
                <Skeleton className="h-4 w-full mb-8" />

                <div className="space-y-6">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  ))}

                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-64 mb-1" />
                    <Skeleton className="h-4 w-48" />
                  </div>

                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="border rounded-lg overflow-hidden">
              <div className="p-6">
                <Skeleton className="h-8 w-48 mb-6" />

                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-32 w-full" />
                  </div>

                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map and Store Locations */}
        <div className="mb-12">
          <Skeleton className="h-8 w-48 mx-auto mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="p-6">
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-64 mb-4" />
                  <Skeleton className="aspect-video w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
