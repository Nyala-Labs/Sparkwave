import {
  approveEventContract,
  getAllPeopleApprovalListContract,
  getAllStatusesContract,
  getEventContract,
  getEventsContract,
  newEventContract,
  reviewerEventContract,
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
    approve: approveEventContract,
    getReviewers: reviewerEventContract,
  },
};
