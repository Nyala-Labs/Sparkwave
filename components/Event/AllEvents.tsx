import { GetEvents } from "@/data/callables/events/GetEvents";
import Link from "next/link";

const AllEvents = async () => {
  const allEvents = await GetEvents();

  return (
    <>
      {allEvents.map((event) => (
        <Link
          href={`/dashboard/events/${event.slug}`}
          key={event.id}
          className="p-4 bg-base-200 rounded-lg shadow-xl min-h-30 h-full"
        >
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-bold">{event.title}</h3>
            <span className="badge">{event.eventType}</span>
          </div>
          <p className="text-sm text-base-content/70">{event.description}</p>
        </Link>
      ))}
    </>
  );
};

export default AllEvents;
