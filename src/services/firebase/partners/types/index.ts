import { Timestamp } from "firebase/firestore";

export interface Partner {
  id: string;
  name: string;
  description: string;
  link: string;
  logo_url: string;
  logo_media: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by: string;
  updated_by: string;
  is_active: boolean;
}

export type CreatePartnerData = Omit<Partner, "id" | "created_at" | "updated_at" | "is_active">;
export type UpdatePartnerData = Partial<Omit<Partner, "id" | "created_at" | "updated_at" | "created_by">>;
