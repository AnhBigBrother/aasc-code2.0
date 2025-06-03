import { z } from "zod";

const ProfileSchema = z
  .object({
    email: z.string().email(),
    username: z
      .string()
      .min(3, {
        message: "User name must has at least 3 characters",
      })
      .max(30, {
        message: "User name must has at most 30 characters",
      }),
    nickname: z.string().max(30, {
      message: "Nick name must has at most 30 characters",
    }),
    newPassword: z
      .string()
      .refine((newPwd: string) => newPwd === "" || newPwd.length >= 6, {
        message: "Password must be 6 characters or longer",
      }),
    confirmPassword: z.string(),
    age: z.number().min(5, {message: "Age must be at least 5 years old"}).optional().or(z.literal('')),
    image: z.string().url().optional().or(z.literal('')),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

type ProfileData = z.infer<typeof ProfileSchema>;

export { ProfileSchema, type ProfileData };
