"use client";
import { ApproveStateChangeAction } from "@/data/actions/events/ApproveStateChangeAction";
import { useServerAction } from "@orpc/react/hooks";
import React, { useState } from "react";

const ApproveEventForm = ({ statusHistoryId }: { statusHistoryId: number }) => {
  const { execute, isPending } = useServerAction(ApproveStateChangeAction);
  const [comment, setComment] = useState("");
  return (
    <div className="flex-1 flex flex-col justify-end mt-10">
      <div className="flex flex-row gap-px">
        <span className="rounded-full size-2.5 bg-red-400 animate-pulse"></span>
        <h3 className="text-xl font-bold">Approval</h3>
      </div>
      <div className="flex flex-col flex-wrap gap-2 mt-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="textarea textarea-bordered resize-none w-full max-w-sm"
          placeholder="Optional comment"
        />
        <div className="flex flex-row items-center gap-2 mt-2">
          <button
            disabled={isPending}
            className="btn btn-error text-white"
            onClick={() =>
              execute({
                decision: "reject",
                statusHistoryId,
                note: comment,
              })
            }
          >
            {isPending ? "Rejecting..." : "Reject"}
          </button>
          <button
            disabled={isPending}
            className="btn btn-success text-white"
            onClick={() =>
              execute({
                decision: "approve",
                statusHistoryId,
                note: comment,
              })
            }
          >
            {isPending ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveEventForm;
