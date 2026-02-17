"use client";
import { StateChangeAction } from "@/data/actions/events/StateChangeAction";
import { peopleApprovalListSchema } from "@/libs/schema/event.schema";
import { useServerAction } from "@orpc/react/hooks";
import { X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SelectedPersonProps = {
  id: number;
  name: string;
  email: string;
  profile: string;
};

const PeopleSearch = ({ people }: { people: SelectedPersonProps[] }) => {
  const [selectedPeople, setSelectedPeople] = useState<SelectedPersonProps[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { execute, status } = useServerAction(StateChangeAction);
  const pathName = usePathname();
  const handleSelect = (person: SelectedPersonProps) => {
    if (selectedPeople.some((p) => p.id === person.id)) {
      setSelectedPeople(selectedPeople.filter((p) => p.id !== person.id));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };
  const handleSubmit = () => {
    const parsed = peopleApprovalListSchema.safeParse(selectedPeople);
    if (parsed.success) {
      execute({
        stage: "ideation",
        peopleApprovalList: parsed.data,
        slug: pathName.split("/")[3],
      });
    } else {
      console.error("Invalid people approval list:", parsed.error);
    }
  };
  return (
    <form action={handleSubmit}>
      <div className="border p-2 rounded-lg">
        {selectedPeople.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedPeople.map((person) => (
              <div
                key={person.id}
                className="flex items-center bg-primary text-primary-content px-3 py-1 rounded-full"
              >
                <Image
                  width={16}
                  height={16}
                  src={person.profile}
                  alt={person.name}
                  className="size-6 rounded-full mr-2"
                />
                <span className="mr-2">{person.name}</span>
                <button
                  onClick={() => handleSelect(person)}
                  className="text-sm font-bold"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          className="input w-full"
          placeholder="Search for people"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mt-5 max-h-60 overflow-y-auto  w-full">
        {people
          .filter(
            (person) =>
              person.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
              !selectedPeople.some((p) => p.id === person.id),
          )
          .map((person) => (
            <div
              key={person.id}
              className="p-2  hover:bg-base-300 cursor-pointer"
              onClick={() => {
                setSearchTerm("");
                handleSelect(person);
              }}
            >
              <div className="flex items-center">
                <Image
                  width={32}
                  height={32}
                  src={person.profile}
                  alt={person.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-gray-500">{person.email}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="divider"></div>
      <button
        className="btn btn-primary w-full"
        disabled={selectedPeople.length === 0 || status === "pending"}
      >
        {status === "pending" ? "Submitting..." : "Submit for Approval"}
      </button>
    </form>
  );
};

export default PeopleSearch;
