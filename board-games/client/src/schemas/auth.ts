import { z } from "zod";

const LoginSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "User name must be 3 characters or longer",
    })
    .max(30, {
      message: "User name must be less than 30 characters",
    }),

  password: z.string().min(6, {
    message: "Password must be 6 characters or longer",
  }),
});

const SignupSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3, {
      message: "User name must be 3 characters or longer",
    })
    .max(30, {
      message: "User name must be less than 30 characters",
    }),
  password: z.string().min(6, {
    message: "Password must be 6 characters or longer",
  }),
});

type LoginData = z.infer<typeof LoginSchema>;
type SignupData = z.infer<typeof SignupSchema>;

export { LoginSchema, SignupSchema, type LoginData, type SignupData };
