import useUserStore from "@/stores/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { _post } from "@/api/request";

export const Header = () => {
  const user = useUserStore.use.user();
  const resetUser = useUserStore.use.reset();
  const handleLogout = () => {
    _post("/user/logout")
      .then((res) => {
        console.log(res);
        resetUser();
        toast.success("Loged out");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.message || "Something went wrong");
      });
  };
  return (
    <header className="sticky left-0 top-0 z-10 w-full h-20 bg-secondary border-b px-[20%] flex flex-row justify-between items-center">
      <nav className="flex items-center font-semibold text-lg underline gap-3">
        <Link to={{ pathname: "/" }}>Home</Link>
        <Link to={{ pathname: "/games/caro" }}>Caro</Link>
        <Link to={{ pathname: "/games/line98" }}>Line98</Link>
      </nav>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={user?.image || "https://github.com/shadcn.png"}
              alt="user"
            />
            <AvatarFallback>
              <User className="h-full w-full bg-accent p-5" />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Setting</DropdownMenuLabel>
          {user && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to={{ pathname: "/profile" }}>
                  <DropdownMenuItem className="cursor-pointer">
                    Profile
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </>
          )}
          {!user && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link to={{ pathname: "/auth/login" }}>
                  <DropdownMenuItem className="cursor-pointer">
                    Log in
                  </DropdownMenuItem>
                </Link>
                <Link to={{ pathname: "/auth/signup" }}>
                  <DropdownMenuItem className="cursor-pointer">
                    Sign up
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </>
          )}
          {user && (
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleLogout()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
