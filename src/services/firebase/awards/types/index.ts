import { DocumentReference } from "firebase/firestore";
import { BaseRecordDetails } from "@/@types/rims.types";

export interface Award extends BaseRecordDetails {
  id: string;
  award_name: string;
  title: string;
  recipient_ref: DocumentReference;
  institution_body?: string;
  country?: string;
  month_year?: string;
  sources: DocumentReference[];
}