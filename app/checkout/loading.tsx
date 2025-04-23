import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Skeleton className="h-10 w-64 mx-auto mb-8" />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>

          <Skeleton className="h-12 w-full" />
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Skeleton className="h-8 w-48 mb-6" />

            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}

              <div className="h-[1px] bg-gray-200 my-4" />

              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24" />
              </div>

              <Skeleton className="h-32 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
