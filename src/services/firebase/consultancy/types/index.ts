import { BaseRecordDetails } from "@/@types/rims.types";
import { DocumentReference } from "firebase/firestore";

export type ProjectStatus =
  | "ongoing"
  | "completed";

export interface ConsultancyProject extends BaseRecordDetails {
  id: string;
  project_title: string;
  amount?: number;
  organization?: string;
  organization_url?: string;
  principal_investigator_ref: DocumentReference;
  co_investigators_refs: DocumentReference[];
  institution?: string;
  duration?: string;
  grant_date?: string;
  status: ProjectStatus;
  sources: DocumentReference[];
}