import { z } from "zod";
const registrationSchema = z
  .object({
    email: z.string().email({ message: "Érvénytelen email cím" }),
    name: z.string().min(2, { message: "Legalább 2 karakter szükséges!" }),
    password: z.string().min(6, { message: "Legalább 6 karakter szükséges!" }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "A két jeszó nem egyezik!",
    path: ["passwordConfirm"],
  });

export default registrationSchema;
export type RegisterUser = z.infer<typeof registrationSchema>;
