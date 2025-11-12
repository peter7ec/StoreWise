import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./FireBaseConfig";
import type { List } from "../types/listsType";

export default async function getListData(userId: string) {
  try {
    const q = query(
      collection(db, "lists"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const userLists = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        userId: data.userId,
        createdAt: (data.createdAt as Timestamp).toDate(),
      };
    });

    return userLists as List[];
  } catch (err) {
    console.error("Hiba a listák lekérdezése közben:", err);
  }
  return;
}
