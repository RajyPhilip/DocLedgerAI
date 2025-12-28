import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,

        setUser: (user) =>
          set({ user }, false, "user/setUser"),

        logout: () =>
          set({ user: null }, false, "user/logout"),
      }),
      {
        name: "user-storage", // 🔐 localStorage key
        partialize: (state) => ({ user: state.user }), // only persist user
      }
    ),
    {
      name: "UserStore",
    }
  )
);

export default useUserStore;
