import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useUserStore = create(
  devtools(
    (set) => ({
      user: null,

      setUser: (user) =>
        set({ user }, false, "user/setUser"),

      logout: () =>
        set({ user: null }, false, "user/logout"),
    }),
    {
      name: "UserStore", 
    }
  )
);

export default useUserStore;
