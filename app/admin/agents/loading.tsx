import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AgentsLoading() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Card className="border-yammy-blue/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              <Skeleton className="h-6 w-24" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48 mt-1" />
            </CardDescription>
          </div>
          <Skeleton className="h-10 w-28" />
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-10 w-64" />
          </div>

          <div className="rounded-md border">
            <div className="border-b">
              <div className="flex items-center h-12 px-4 gap-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <div className="ml-auto">
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>

            {/* Loading rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center h-16 px-4 gap-4 border-b last:border-b-0">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <div className="ml-auto flex gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
