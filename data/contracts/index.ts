import {
  getAllPeopleApprovalListContract,
  getAllStatusesContract,
  getEventContract,
  getEventsContract,
  newEventContract,
  transitionEventContract,
} from "./event";

export const routerContract = {
  events: {
    new: newEventContract,
    get: getEventsContract,
    single: getEventContract,
    statuses: getAllStatusesContract,
    getPeople: getAllPeopleApprovalListContract,
    transition: transitionEventContract,
  },
};
