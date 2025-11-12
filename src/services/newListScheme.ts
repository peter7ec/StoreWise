import { z } from "zod";
export const newListScehem = z.object({
  listName: z.string().min(1, { message: "Nevet kell adni a listának!" }),
});

export type NewList = z.infer<typeof newListScehem>;
