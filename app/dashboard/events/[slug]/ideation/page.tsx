import IdeationEvent from "@/components/Event/IdeationEvent";
import IdeationEventSkeleton from "@/components/Event/IdeationSkeleton";
import { Suspense } from "react";

const IdeationPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<IdeationEventSkeleton />}>
      <IdeationEvent params={params} />
    </Suspense>
  );
};

export default IdeationPage;
