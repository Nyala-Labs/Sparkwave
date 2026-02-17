import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  eventResources,
  events,
  resourceTypeEnum,
  statusTypeEnum,
} from "./events";

export type EventResources = InferInsertModel<typeof eventResources>;
export type EventResourcesSelect = InferSelectModel<typeof eventResources>;
export type EventsType = InferSelectModel<typeof events>;
export type StatusTypeEnum = (typeof statusTypeEnum)[number];
export type ResourceTypeEnum = (typeof resourceTypeEnum)[number];
