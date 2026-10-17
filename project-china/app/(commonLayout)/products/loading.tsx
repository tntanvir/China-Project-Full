import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-[#0A0A10] min-h-screen px-4 pb-24 pt-32">
      <div className="mx-auto max-w-7xl">
        <Skeleton className="mx-auto mb-10 h-12 w-72" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-96 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
