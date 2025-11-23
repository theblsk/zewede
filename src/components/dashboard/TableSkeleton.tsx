import { Card, CardBody, CardHeader, Skeleton } from "@heroui/react";

export function TableSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-md">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="w-32">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-32 rounded-lg" />
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="flex justify-between py-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-20 rounded-lg" />
              ))}
            </div>
            {/* Table Rows */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between py-3">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-32 rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

