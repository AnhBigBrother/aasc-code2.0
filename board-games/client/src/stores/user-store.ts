import createSelectors from "@/stores/selector";
import { create } from "zustand";

export type TUser = {
  id: number;
  email: string;
  username: string;
  nickname: string;
  age?: number | null;
  image?: string | null;
} | null;

export type TUserStore = {
  user: TUser;
  update: (newUser: TUser) => void;
  reset: () => void;
};

const useUserStoreBase = create<TUserStore>()((set) => ({
  user: null,
  update: (newUser: TUser) => set({ user: newUser }),
  reset: () => set({ user: null }),
}));
const useUserStore = createSelectors(useUserStoreBase);

export default useUserStore;
