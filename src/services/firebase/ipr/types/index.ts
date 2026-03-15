import { BaseRecordDetails } from "@/@types/rims.types";
import { DocumentReference, Timestamp } from "firebase/firestore";

export type PatentType =
  | "design"
  | "patent"
  | "copyright"
  | "trademark";

export type IPRStatus =
  | "filed"
  | "granted"
  | "published";

export interface IPR extends BaseRecordDetails {
  id: string;
  faculty_ref: DocumentReference;
  application_no: string;
  title: string;
  inventors: DocumentReference[];
  applicants: string[];
  country: string;
  published_date?: Timestamp;
  patent_type: PatentType;
  status: IPRStatus;
  sources: DocumentReference[];
}