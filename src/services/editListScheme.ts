import { z } from "zod";
export const editListScehem = z.object({
  editedData: z.string().min(1, { message: "Nevet kell adni a listának!" }),
});

export type EditList = z.infer<typeof editListScehem>;
