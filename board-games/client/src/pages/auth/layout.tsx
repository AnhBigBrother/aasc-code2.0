import useUserStore from "@/stores/user-store";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const user = useUserStore.use.user();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);
  return (
    <div className="w-full flex flex-row gap-5 justify-between">
      <Outlet />
      <img
        className="hidden 2xl:block rounded-xl w-[512px] h-[368px] mt-8"
        src="https://storage.googleapis.com/gweb-uniblog-publish-prod/original_images/Social_dino_with_hat.gif"
        alt="running dinasour"
        height={368}
        width={512}
      />
    </div>
  );
};

export default AuthLayout;
