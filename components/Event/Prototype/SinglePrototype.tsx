import Header from "@/components/Header";
import { GetEvent } from "@/data/callables/events/GetEvent";
import { cn } from "@/libs/utils";
import { Github, Plus, X } from "lucide-react";
import Link from "next/link";
import NewGithubRepoForm from "./NewGithubRepoForm";
import PeopleSearch from "@/components/PeopleSearch";
import { GetPeopleApprovalList } from "@/data/callables/events/GetPeopleApprovalList";
import { redirect } from "next/navigation";
import { GetStatuses } from "@/data/callables/events/GetStatuses";
import ResourceCard from "@/components/ResourceCard";
import ApproveEventForm from "../ApproveEventForm";
import { GetReviewersList } from "@/data/callables/events/GetReviewersList";
import { createClient } from "@/libs/supabase/server";

const SinglePrototype = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const statusIdeation = (await GetStatuses()).find(
    (s) => s.name.toLowerCase() === "prototype",
  );
  if (!statusIdeation) redirect("/dashboard/events");
  const [event, peopleApprovalList] = await Promise.all([
    GetEvent({ slug }),
    GetPeopleApprovalList({ statusId: statusIdeation.id }),
  ]);
  const hasGithubResource = event.resources.some((r) => r.type === "github");
  const githubResource = event.resources.find((r) => r.type === "github");
  console.log(event.statusHistory);
  const latestStatus = event.statusHistory?.[1];
  const reviewersList = latestStatus?.id
    ? await GetReviewersList({
        statusHistoryId: latestStatus.id,
      })
    : [];
  const decision = latestStatus?.decision;
  const badge = !decision
    ? { text: "Draft", className: "badge-warning" }
    : decision === "approved"
      ? { text: "Approved", className: "badge-success" }
      : decision === "rejected"
        ? { text: "Rejected", className: "badge-error" }
        : { text: "In Review", className: "badge-info" };

  const canRequestApproval =
    decision !== "submitted" && decision !== "approved";
  const buttonLabel = decision === "rejected" ? "Resubmit" : "Get Approval";
  const user = (await (await createClient()).auth.getUser()).data.user;

  if (!user) redirect("/");

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
          <Header>Prototype - {event.title}</Header>

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
                  <PeopleSearch
                    stage="production"
                    people={peopleApprovalList}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="mt-10 flex flex-row items-center gap-2 mb-4">
        <Github className=" size-7" />
        <p className="text-2xl font-semibold  required ">Github</p>
      </div>
      {hasGithubResource ? (
        <Link href={githubResource!.url} target="_blank" className="max-w-96">
          <div
            className={cn(
              "h-40 border rounded-xl shadow-md bg-base-200 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-green-500 flex items-center justify-center",
            )}
          >
            <div className="text-center">
              <p className="text-xl font-semibold">{githubResource?.name}</p>
              <p className="text-sm opacity-70 mt-1">
                Created {githubResource?.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <label
          htmlFor="github_repo_modal"
          className={cn(
            "max-w-96 h-40 cursor-pointer border-2 border-dashed rounded-xl bg-base-200 transition-all duration-200 hover:bg-base-300 hover:scale-[1.02] flex items-center justify-center",
          )}
        >
          <div className="text-center">
            <p className="text-xl font-semibold">
              Create Github Repo
              <Plus className="inline ml-2 size-5" />
            </p>
            <p className="text-sm opacity-70 mt-1">
              Click to connect a repository
            </p>
          </div>
        </label>
      )}

      <input type="checkbox" id="github_repo_modal" className="modal-toggle" />
      <NewGithubRepoForm title={event.title} slug={slug} />

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

export default SinglePrototype;
