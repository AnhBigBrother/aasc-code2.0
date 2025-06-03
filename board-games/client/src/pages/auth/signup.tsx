import { useForm } from "react-hook-form";
import { AuthWrapper } from "./auth-wrapper";
import { SignupSchema, type SignupData } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useUserStore, { type TUser } from "@/stores/user-store";
import { _post } from "@/api/request";

const Signup = () => {
  const [isPending, setIsPending] = useState(false);
  const updateUser = useUserStore.use.update();
  const resetUser = useUserStore.use.reset();
  const form = useForm<SignupData>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupData) => {
    setIsPending(true);
    _post("/user/signup", { body: data })
      .then((data: TUser) => {
        if (!data) {
          resetUser();
          return;
        }
        updateUser({
          email: data.email,
          id: data.id,
          nickname: data.nickname,
          username: data.username,
          age: data.age,
          image: data.image,
        });
        toast.success("Account has been created");
      })
      .catch((err) => {
        toast.error(err.message || "Sign up failed");
        console.error(err);
      })
      .finally(() => setIsPending(false));
  };

  return (
    <AuthWrapper
      headerLabel="Sign up"
      footerLinkLabel="Already have account? Login here!"
      footerLinkHref="/auth/login"
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email"></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">User name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="user name"></Input>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="password"
                  ></PasswordInput>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          ></FormField>
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={isPending}
            >
              Signup
            </Button>
            <Button
              onClick={() => form.reset()}
              variant="outline"
              className="cursor-pointer"
              type="button"
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </AuthWrapper>
  );
};

export default Signup;
