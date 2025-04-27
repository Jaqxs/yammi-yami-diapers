import { Skeleton } from "@/components/ui/skeleton"

export default function AgentsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yammy-light-blue/10 to-yammy-pink/10 p-4">
      <div className="max-w-4xl mx-auto py-16 text-center">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
        <Skeleton className="h-10 w-48 mx-auto rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto py-12">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>

      <div className="max-w-6xl mx-auto py-12">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <Skeleton className="h-10 w-full mb-8 rounded-xl" />
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    </div>
  )
}
