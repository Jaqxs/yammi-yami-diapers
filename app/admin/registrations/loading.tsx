import { Skeleton } from "@/components/ui/skeleton"

export default function RegistrationsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <Skeleton className="h-10 w-full max-w-sm mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
        <div className="border-t">
          <div className="grid grid-cols-6 p-4">
            <Skeleton className="h-4 w-full col-span-1" />
            <Skeleton className="h-4 w-full col-span-1" />
            <Skeleton className="h-4 w-full col-span-1" />
            <Skeleton className="h-4 w-full col-span-1" />
            <Skeleton className="h-4 w-full col-span-1" />
            <Skeleton className="h-4 w-full col-span-1" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 p-4 border-t">
              <Skeleton className="h-4 w-3/4 col-span-1" />
              <Skeleton className="h-4 w-3/4 col-span-1" />
              <Skeleton className="h-4 w-3/4 col-span-1" />
              <Skeleton className="h-4 w-3/4 col-span-1" />
              <Skeleton className="h-4 w-3/4 col-span-1" />
              <Skeleton className="h-4 w-3/4 col-span-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
