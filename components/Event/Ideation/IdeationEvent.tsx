import { GetEvent } from "@/data/callables/events/GetEvent";
import { GetPeopleApprovalList } from "@/data/callables/events/GetPeopleApprovalList";
import { GetStatuses } from "@/data/callables/events/GetStatuses";
import { redirect } from "next/navigation";
import { X } from "lucide-react";
import { GetReviewersList } from "@/data/callables/events/GetReviewersList";
import { createClient } from "@/libs/supabase/server";
import Header from "@/components/Header";
import PeopleSearch from "@/components/PeopleSearch";
import ResourceCard from "@/components/ResourceCard";
import ApproveEventForm from "../ApproveEventForm";

const IdeationEvent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const statusIdeation = (await GetStatuses()).find(
    (s) => s.name.toLowerCase() === "ideation",
  );
  if (!statusIdeation) redirect("/dashboard/events");
  const [event, _, peopleApprovalList] = await Promise.all([
    GetEvent({ slug, resourceCreatedByDefault: false }),
    GetStatuses(),
    GetPeopleApprovalList({ statusId: statusIdeation?.id }),
  ]);

  if (!event) redirect("/dashboard/events");

  const latestStatus = event.statusHistory?.[0];

  const decision = latestStatus?.decision;

  const reviewersList = latestStatus?.id
    ? await GetReviewersList({
        statusHistoryId: latestStatus.id,
      })
    : [];

  const user = (await (await createClient()).auth.getUser()).data.user;

  if (!user) redirect("/");

  const canRequestApproval =
    decision !== "submitted" && decision !== "approved";

  const buttonLabel = decision === "rejected" ? "Resubmit" : "Get Approval";

  const badge = !decision
    ? { text: "Draft", className: "badge-warning" }
    : decision === "approved"
      ? { text: "Approved", className: "badge-success" }
      : decision === "rejected"
        ? { text: "Rejected", className: "badge-error" }
        : { text: "In Review", className: "badge-info" };

  const isReviewer =
    decision === "submitted" &&
    reviewersList.length > 0 &&
    reviewersList
      .flatMap((r) => r.reviewer)
      .some((r) => r.supabaseId === user.id);

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between items-center">
        <div className="flex gap-2 items-center flex-row">
          <Header>Ideation - {event.title}</Header>

          <div className={`badge badge-soft ${badge.className} px-3 py-px`}>
            {badge.text}
            {latestStatus?.decision !== "submitted" && latestStatus?.note && (
              <span>- {latestStatus.note}</span>
            )}
          </div>
        </div>

        {canRequestApproval && (
          <>
            <label htmlFor="my_modal_6" className="btn btn-primary">
              {buttonLabel}
            </label>

            <input type="checkbox" id="my_modal_6" className="modal-toggle" />

            <div className="modal" role="dialog">
              <div className="modal-box">
                <div className="flex flex-row items-center justify-between">
                  <h3 className="text-lg font-bold">
                    Select People to Approve
                  </h3>
                  <label htmlFor="my_modal_6">
                    <X className="size-5 cursor-pointer" />
                  </label>
                </div>

                <div className="mt-5">
                  <PeopleSearch stage="ideation" people={peopleApprovalList} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="text-xl font-semibold mb-4 required mt-10">
        Required Resources
      </p>

      <ResourceCard
        resources={event.resources.filter((r) => r.createdByDefault)}
      />

      {isReviewer && latestStatus?.id && (
        <ApproveEventForm statusHistoryId={latestStatus.id} />
      )}
    </div>
  );
};

export default IdeationEvent;
