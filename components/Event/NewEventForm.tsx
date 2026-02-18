"use client";
import { CreateEventAction } from "@/data/actions/events/CreateEventAction";
import { newEventSchema } from "@/libs/schema/event.schema";
import { useServerAction } from "@orpc/react/hooks";
import { useRouter } from "next/navigation";
import z from "zod";

const NewEventForm = () => {
  const { execute, status } = useServerAction(CreateEventAction);
  const router = useRouter();
  const action = async (form: FormData) => {
    const input = Object.fromEntries(form.entries());
    const parsed = newEventSchema.safeParse(input);
    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return;
    }
    execute(parsed.data);
    if (status === "success") {
      router.push(`/dashboard/events/${parsed.data.slug}`);
    }
  };
  return (
    <form
      action={action}
      className="card bg-base-100 shadow-xl p-6 max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold">New Event</h2>
        <p className="text-sm text-base-content/60">
          Fill out the details below to create a new event.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(newEventSchema.shape).map(([key, field]) => {
          if (key === "slug") return null;

          const label = key.charAt(0).toUpperCase() + key.slice(1);

          return (
            <div key={key} className="form-control w-full">
              <label htmlFor={key} className="label mb-2">
                <span className="label-text font-medium text-white">
                  {label}
                </span>
              </label>

              {field instanceof z.ZodString ? (
                <input
                  id={key}
                  name={key}
                  type="text"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="input input-secondary w-full"
                />
              ) : field instanceof z.ZodNumber ? (
                <input
                  id={key}
                  name={key}
                  type="number"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="input input-secondary w-full"
                />
              ) : field instanceof z.ZodEnum ? (
                <select
                  id={key}
                  name={key}
                  className="select select-secondary w-full"
                >
                  <option disabled value="" className="option">
                    Select {label}
                  </option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={key}
                  name={key}
                  type="text"
                  disabled
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="input input-secondary w-full"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="divider"></div>
      <div className="modal-action">
        <label htmlFor={`modal_New Event`} className="btn btn-secondary">
          Cancel
        </label>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === "pending"}
        >
          {status === "pending" ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default NewEventForm;
