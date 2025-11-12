import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./FireBaseConfig";

export async function deleteList(listId: string): Promise<void> {
  try {
    const listDocRef = doc(db, "lists", listId);

    await deleteDoc(listDocRef);
  } catch (err) {
    console.error(err);
  }
}
