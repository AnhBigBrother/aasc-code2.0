import { AuthWrapper } from "./auth-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginData } from "@/schemas/auth";
import { Input, PasswordInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useUserStore, { type TUser } from "@/stores/user-store";
import { toast } from "sonner";
import { _post } from "@/api/request";

const Login = () => {
  const [isPending, setIsPending] = useState(false);
  const updateUser = useUserStore.use.update();
  const resetUser = useUserStore.use.reset();
  const form = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginData) => {
    setIsPending(true);
    _post("/user/login", { body: data })
      .then((data: TUser) => {
        if (!data) {
          resetUser();
          return;
        }
        updateUser({
          email: data?.email,
          id: data?.id,
          nickname: data?.nickname,
          username: data?.username,
          age: data?.age,
          image: data?.image,
        });
        toast.success("You has been loged in");
      })
      .catch((err) => {
        toast.error(err.message || "Sign up failed");
        console.error(err);
      })
      .finally(() => setIsPending(false));
  };

  return (
    <AuthWrapper
      headerLabel="Log in"
      footerLinkLabel="Don't have an account? Signup here!"
      footerLinkHref="/auth/signup"
    >
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">User name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="user_name"></Input>
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
              Login
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

export default Login;
