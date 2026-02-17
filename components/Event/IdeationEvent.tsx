import { GetEvent } from "@/data/callables/events/GetEvent";
import { GetPeopleApprovalList } from "@/data/callables/events/GetPeopleApprovalList";
import { GetStatuses } from "@/data/callables/events/GetStatuses";
import { redirect } from "next/navigation";
import Header from "../Header";
import PeopleSearch from "../PeopleSearch";
import ResourceCard from "../ResourceCard";
import { Suspense } from "react";
import { X } from "lucide-react";

const IdeationEvent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const [event, _, peopleApprovalList] = await Promise.all([
    GetEvent({ slug, resourceCreatedByDefault: false }),
    GetStatuses(),
    GetPeopleApprovalList({ statusId: 2 }),
  ]);
  if (!event) redirect("/dashboard/events");
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-2 items-center flex-row">
          <Header>Ideation - {event.title}</Header>
          {event.statusHistory.length === 0 ? (
            <div className="badge badge-soft badge-warning px-3 py-px">
              Draft
            </div>
          ) : event.statusHistory[0].decision === "approved" ? (
            <div className="badge badge-soft badge-success px-3 py-px">
              Approved
            </div>
          ) : (
            <div className="badge badge-soft badge-error px-3 py-px">
              Rejected
            </div>
          )}
        </div>
        <label htmlFor="my_modal_6" className="btn btn-primary">
          {event.statusHistory.length > 0 &&
          event.statusHistory[0].decision === "rejected"
            ? "Resubmit"
            : "Get Approval"}
        </label>

        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box">
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-bold">Select People to Approve</h3>
              <label htmlFor="my_modal_6">
                <X className="size-5 cursor-pointer" />
              </label>
            </div>
            <div className="mt-5">
              <PeopleSearch people={peopleApprovalList} />
            </div>
          </div>
        </div>
      </div>
      <p className="text-xl font-semibold mb-4 required mt-10">
        Required Resources
      </p>

      <ResourceCard
        resources={event.resources.filter((r) => r.createdByDefault)}
      />
    </Suspense>
  );
};

export default IdeationEvent;
