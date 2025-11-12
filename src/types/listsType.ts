import type { DocumentData } from "firebase/firestore";

export interface List extends DocumentData {
  id: string;
  name: string;
  createdAt: Date;
  userId: string;
}
