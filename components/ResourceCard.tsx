import { resourceSchema } from "@/db/schema/events";
import { getResourceIcon } from "@/libs/utils";
import { z } from "zod";

type ResourceType = z.infer<typeof resourceSchema>;

const ResourceCard = ({ resources }: { resources: ResourceType[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => (
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
  );
};

export default ResourceCard;
