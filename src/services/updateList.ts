import { doc, updateDoc } from "firebase/firestore";
import { db } from "./FireBaseConfig";

export async function updateList(
  listId: string,
  newName: string
): Promise<void> {
  try {
    const listDocRef = doc(db, "lists", listId);

    await updateDoc(listDocRef, {
      name: newName,
    });
  } catch (err) {
    console.error(err);
  }
}
