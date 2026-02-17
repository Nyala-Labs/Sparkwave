import Dialog from "@/components/Dialog";
import Header from "@/components/Header";
import NewEventForm from "@/components/Event/NewEventForm";
import AllEvents from "@/components/Event/AllEvents";
import { Suspense } from "react";

export default function EventsPage() {
  return (
    <div>
      <div className="flex flex-row items-center justify-between">
        <Header>Events</Header>
        <Dialog btnTitle="New Event" submitTitle="Create">
          <NewEventForm />
        </Dialog>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-10 gap-5">
        <Suspense fallback={<AllEventsFallback />}>
          <AllEvents />
        </Suspense>
      </div>
    </div>
  );
}
function AllEventsFallback() {
  return (
    <>
      {Array.from({ length: 3 }).map((_: unknown, i: number) => (
        <div
          key={i}
          className="p-4 bg-base-200 rounded-lg shadow-xl min-h-30 h-full animate-pulse"
        ></div>
      ))}
    </>
  );
}
