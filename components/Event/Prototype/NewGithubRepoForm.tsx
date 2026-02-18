"use client";
import { CreateGithubRepoAction } from "@/data/actions/events/CreateGithubRepoAction";
import { newRepoSchema } from "@/libs/schema/event.schema";
import { useServerAction } from "@orpc/react/hooks";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const NewGithubRepoForm = ({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) => {
  const { execute, isPending } = useServerAction(CreateGithubRepoAction);
  const router = useRouter();
  async function handleCreateGithubRepo(formData: FormData) {
    const data = Object.fromEntries(formData);
    const parsed = newRepoSchema.safeParse({ ...data, eventSlug: slug });
    if (!parsed.success) {
      console.error("Invalid form data:", parsed.error.flatten());
      return;
    }
    execute(parsed.data);
    router.push(`/dashboard/events/${slug}/prototype`);
  }
  return (
    <form className="modal" role="dialog" action={handleCreateGithubRepo}>
      <div className="modal-box space-y-4 ">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-bold mb-2">
            Create a new Github Repository
          </h3>
          <label htmlFor="github_repo_modal">
            <X className="size-5 cursor-pointer" />
          </label>
        </div>
        <div>
          <label htmlFor={"title"} className="label mb-2">
            <span className="label-text font-medium text-white required">
              Title
            </span>
          </label>

          <input
            className="input input-secondary w-full"
            name="title"
            defaultValue={title}
          />
        </div>
        <div>
          <label htmlFor={"description"} className="label mb-2">
            <span className="label-text font-medium text-white required">
              Description
            </span>
          </label>

          <textarea
            className="textarea-secondary w-full textarea h-24 resize-none"
            name="description"
          />
        </div>
        <div className="divider"></div>
        <div className="modal-action">
          <button
            className="btn btn-primary w-full"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Creating..." : "Create Repository"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewGithubRepoForm;
