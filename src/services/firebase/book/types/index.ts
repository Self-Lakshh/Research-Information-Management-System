import { BaseRecordDetails } from "@/@types/rims.types";
import { DocumentReference } from "firebase/firestore";

export interface Book extends BaseRecordDetails {
  id: string;
  author: DocumentReference;
  title_of_book: string;
  date_of_publication?: string;
  ISBN_number?: string;
  publisher_name?: string;
  sources: DocumentReference[];
}