import SingleEvent from "@/components/Event/SingleEvent";
import SingleEventSkeleton from "@/components/Event/SingleEventSkeleton";
import { Suspense } from "react";

export default async function SingleEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<SingleEventSkeleton />}>
      <SingleEvent params={params} />
    </Suspense>
  );
}
