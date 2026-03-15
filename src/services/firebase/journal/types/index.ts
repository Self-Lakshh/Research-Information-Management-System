import { BaseRecordDetails } from "@/@types/rims.types";
import { DocumentReference } from "firebase/firestore";

export interface Journal extends BaseRecordDetails {
  id: string;
  title_of_paper: string;
  authors: DocumentReference[];
  journal_name: string;
  journal_type?: string;
  date_of_publication?: string;
  ISSN_number?: string;
  web_link?: string;
  sources: DocumentReference[];
}