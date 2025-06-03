import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import Home from "./pages/home";
import AuthLayout from "./pages/auth/layout";
import GamesLayout from "./pages/games/layout";
import Profile from "./pages/profile";
import Line98 from "./pages/games/line98";
import CaroBoard from "./pages/games/caro";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import { useEffect } from "react";
import { Toaster } from "sonner";
import useUserStore, { type TUser } from "./stores/user-store";
import { _get } from "./api/request";

function App() {
  const updateUser = useUserStore.use.update();
  const resetUser = useUserStore.use.reset();
  useEffect(() => {
    _get("/user/profile")
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
      })
      .catch((err) => {
        console.error(err);
        resetUser();
      });
  }, []);
  return (
    <BrowserRouter>
      <div className="bg-background w-full min-h-screen relative">
        <Header />
        <Toaster position="top-center" theme="light" richColors offset={100} />
        <main className="px-[20%] py-3">
          <Routes>
            <Route index element={<Home />}></Route>
            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />}></Route>
              <Route path="signup" element={<Signup />}></Route>
            </Route>
            <Route path="games" element={<GamesLayout />}>
              <Route path="line98" element={<Line98 />}></Route>
              <Route path="caro" element={<CaroBoard />}></Route>
            </Route>
            <Route path="profile" element={<Profile />}></Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
