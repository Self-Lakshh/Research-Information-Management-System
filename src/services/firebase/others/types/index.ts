import { BaseRecordDetails } from "@/@types/rims.types";
import { DocumentReference } from "firebase/firestore";

export type EventType =
  | "FDP"
  | "Seminar"
  | "Workshop"
  | "Keynote Speaker";

export interface OtherEvent extends BaseRecordDetails {
  id: string;
  type: EventType;
  topic_title: string;
  organization?: string;
  date?: string;
  role?: string;
  involved_faculty_refs: DocumentReference[];
  sources: DocumentReference[];
}