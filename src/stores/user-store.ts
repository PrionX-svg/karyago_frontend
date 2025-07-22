import { UserType } from "@/lib/types/user-type";
import { create } from "zustand";

type UserStore = {
    user: UserType;
    setUser: (user: UserType) => void;
    removeUser: (uuid: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: {
        uuid: "",
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        isFreelance: false,
        role: ""
    },
    setUser: (user) => set({ user }),
    removeUser: (uuid) => set((state) => ({
        user: state.user.uuid === uuid ? {
            uuid: "",
            fullName: "",
            email: "",
            phone: "",
            gender: "",
            dob: "",
            isFreelance: false,
            role: ""
        } : state.user
    }))
}))
