import { BaseRecordDetails } from "@/@types/rims.types";
import { DocumentReference } from "firebase/firestore";

export interface Conference extends BaseRecordDetails {
  id: string;
  authors: DocumentReference[];
  title_of_paper: string;
  title_of_proceedings_of_conference?: string;
  name_of_conference: string;
  origin?: string;
  year_of_publication?: string;
  isbn_issn_number?: string;
  name_of_publisher?: string;
  sources: DocumentReference[];
}