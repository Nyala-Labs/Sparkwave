import { CreateEventAction } from "./actions/events/CreateEventAction";
import { StateChangeAction } from "./actions/events/StateChangeAction";
import { GetEvent } from "./callables/events/GetEvent";
import { GetEvents } from "./callables/events/GetEvents";
import { GetPeopleApprovalList } from "./callables/events/GetPeopleApprovalList";
import { GetStatuses } from "./callables/events/GetStatuses";
import { os } from "./os";

export const router = os.router({
  events: {
    new: CreateEventAction,
    get: GetEvents,
    single: GetEvent,
    statuses: GetStatuses,
    getPeople: GetPeopleApprovalList,
    transition: StateChangeAction,
  },
});
