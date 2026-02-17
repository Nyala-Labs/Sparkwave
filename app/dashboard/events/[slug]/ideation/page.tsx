import IdeationEvent from "@/components/Event/IdeationEvent";
import { Suspense } from "react";

const IdeationPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IdeationEvent params={params} />
    </Suspense>
  );
};

export default IdeationPage;
