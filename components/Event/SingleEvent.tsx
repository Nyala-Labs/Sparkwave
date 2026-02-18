import { GetEvent } from "@/data/callables/events/GetEvent";
import { GetStatuses } from "@/data/callables/events/GetStatuses";
import { cn, getResourceIcon } from "@/libs/utils";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import Header from "../Header";

export default async function SingleEvent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await GetEvent({ slug });
  const statuses = await GetStatuses();

  if (!event) redirect("/dashboard/events");

  const sortedStatuses = [...statuses].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  const currentStatus = sortedStatuses.find(
    (s) => s.id === event.currentStatusId,
  );
  console.log("Dwd", sortedStatuses, currentStatus);
  return (
    <div>
      <Header>{event.title}</Header>

      <div className="flex flex-col items-center my-10 w-full">
        <ul className="timeline justify-center">
          {sortedStatuses.map((status, index) => {
            const isCompleted =
              currentStatus && status.orderIndex < currentStatus.orderIndex;

            const isCurrent = status.id === event.currentStatusId;

            const isLast = index === sortedStatuses.length - 1;

            return (
              <li key={status.id} className="max-w-40 w-full">
                {index !== 0 && (
                  <hr
                    className={cn(
                      "w-full",
                      isCompleted || isCurrent ? "bg-primary" : "bg-secondary",
                    )}
                  />
                )}

                <div className="timeline-start timeline-box">
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "font-semibold text-lg",
                        isCurrent && "text-primary",
                      )}
                    >
                      {status.name}
                    </span>
                  </div>
                </div>

                <div className="timeline-middle">
                  <div
                    className={cn(
                      "flex items-center justify-center h-6 w-6 rounded-full border",
                      isCompleted
                        ? "bg-primary border-primary text-primary-content"
                        : isCurrent
                          ? "border-primary animate-pulse"
                          : "bg-base-200 border-base-300",
                    )}
                  >
                    {isCompleted && <Check size={14} />}
                    {isCurrent && !isCompleted && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>

                {!isLast && (
                  <hr
                    className={cn(
                      "w-full",
                      isCompleted || isCurrent ? "bg-primary" : "bg-secondary",
                    )}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="text-xl font-semibold mb-4">Resources</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {event.resources.map((resource) => (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border bg-base-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {resource.name}
                </h3>
                <p className="text-sm opacity-60 capitalize">{resource.type}</p>
              </div>

              <div className="text-primary text-xl">
                {getResourceIcon(resource.type)}
              </div>
            </div>

            <div className="text-xs opacity-50">
              Added {new Date(resource.createdAt).toLocaleDateString()}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
