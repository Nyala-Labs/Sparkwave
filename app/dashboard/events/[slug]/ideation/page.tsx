import IdeationEvent from "@/components/Event/Ideation/IdeationEvent";
import IdeationEventSkeleton from "@/components/Event/Ideation/IdeationSkeleton";
import { Suspense } from "react";

const IdeationPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<IdeationEventSkeleton />}>
      <IdeationEvent params={params} />
    </Suspense>
  );
};

export default IdeationPage;
