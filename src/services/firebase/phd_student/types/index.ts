import { BaseRecordDetails } from "@/@types/rims.types";
import { DocumentReference } from "firebase/firestore";

export interface PhDStudent extends BaseRecordDetails {
  id: string;
  name: string;
  faculty_ref: DocumentReference;
  supervisor_type?: string;
  name_of_student: string;
  enrollment_number: string;
  phd_stream?: string;
  sources: DocumentReference[];
}