import IdeationEventSkeleton from "@/components/Event/Ideation/IdeationSkeleton";
import SinglePrototype from "@/components/Event/Prototype/SinglePrototype";
import { Suspense } from "react";

const PrototypePage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<IdeationEventSkeleton />}>
      <SinglePrototype params={params} />
    </Suspense>
  );
};

export default PrototypePage;
