import { _patch } from "@/api/request";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CollapsibleContent,
  CollapsibleMenu,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, PasswordInput } from "@/components/ui/input";
import { ProfileSchema, type ProfileData } from "@/schemas/profile";
import useUserStore from "@/stores/user-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const [isPending, setIsPending] = useState(false);
  const user = useUserStore.use.user();
  const updateUser = useUserStore.use.update();
  const navigate = useNavigate();
  const form = useForm<ProfileData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      email: user?.email ?? "",
      age: user?.age || undefined,
      username: user?.username ?? "",
      nickname: user?.nickname ?? "",
      image: user?.image || undefined,
      newPassword: "",
      confirmPassword: "",
    },
  });
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const onSubmit = async (submitedData: ProfileData) => {
    setIsPending(true);
    const payload = {
      ...(submitedData.username !== user?.username && {
        username: submitedData.username,
      }),
      ...(submitedData.nickname !== user?.nickname && {
        nickname: submitedData.nickname,
      }),
      ...(submitedData.image &&
        submitedData.image !== user?.image && { image: submitedData.image }),
      ...(submitedData.newPassword && { password: submitedData.newPassword }),
      ...(submitedData.age && { age: submitedData.age }),
    };
    _patch("/user/profile", { body: payload })
      .then((data) => {
        updateUser({
          email: data.email,
          id: data.id,
          nickname: data.nickname,
          username: data.username,
          age: data.age,
          image: data.image,
        });
        toast.success("Your profile has been updated");
        navigate("/");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message || "Something went wrong, try later");
      })
      .finally(() => setIsPending(false));
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="w-full grid grid-cols-4 justify-items-end">
          <div className="w-full flex flex-col col-span-3 gap-y-4">
            <FormField
              name="email"
              render={() => (
                <FormItem
                  title="Cannot change email"
                  className="cursor-not-allowed"
                >
                  <FormLabel>Email</FormLabel>
                  <Input value={user?.email} disabled></Input>
                  <FormDescription>Your registed email.</FormDescription>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div className="flex w-full items-center gap-6">
                  <FormItem className="w-full">
                    <FormLabel>Picture</FormLabel>
                    <FormControl>
                      <Input {...field}></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                    <FormDescription>
                      This is your public profile picture.
                    </FormDescription>
                  </FormItem>
                </div>
              )}
            ></FormField>
          </div>
          <div className="grid items-center h-full max-h-[200px] aspect-square p-5 justify-items-center">
            <Avatar className="h-full w-full rounded-xl">
              <AvatarImage src={form.watch("image")} />
              <AvatarFallback>
                <User className="h-full w-full bg-accent p-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormMessage></FormMessage>
              <FormDescription>Your username.</FormDescription>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nick name</FormLabel>
              <FormControl>
                <Input {...field}></Input>
              </FormControl>
              <FormMessage></FormMessage>
              <FormDescription>Your public nick-name.</FormDescription>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(value) =>
                    field.onChange(value.target.valueAsNumber || 0)
                  }
                ></Input>
              </FormControl>
              <FormMessage></FormMessage>
              <FormDescription>Your age.</FormDescription>
            </FormItem>
          )}
        ></FormField>
        <CollapsibleMenu
          label={<h4 className="font-semibold">Change password?</h4>}
          open={false}
        >
          <CollapsibleContent className="mt-1 flex flex-col gap-2">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field}></PasswordInput>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field}></PasswordInput>
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            ></FormField>
          </CollapsibleContent>
        </CollapsibleMenu>
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            className="cursor-pointer"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isPending}>
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Profile;
