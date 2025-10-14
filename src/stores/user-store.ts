import { UserType } from "@/lib/types/user-type";
import { create } from "zustand";

type UserStore = {
    user: UserType;
    isAuthenticated: boolean;
    setUser: (user: UserType) => void;
    clearUser: () => void;
    updateUser: (user: Partial<UserType>) => void;
    removeUser: (uuid: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: {
        userUuid: "",
        employeeUuid: "",
        name:{ 
            fullName: "",
            firstName: "",
            lastName: ""
        },
        email: "",
        phone: "",
        gender: "",
        dob: "",
        isFreelance: false,
        role: {
            name: "",
            uuid: ""
        }
    },
    isAuthenticated: false,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: undefined }),
    updateUser: (user) => set((state) => ({
        user: {
            ...state.user,
            ...user,
            role: user.role
                ? { ...state.user.role, ...user.role }
                : state.user.role,
            branch: user.branch
                ? { ...state.user.branch, ...user.branch }
                : state.user.branch
        }
    })),
    removeUser: (uuid) => set((state) => ({
        user: state.user.userUuid === uuid ? {
            userUuid: "",
            employeeUuid: "",
            name: {
                fullName: "",
                firstName: "",
                lastName: ""
            },
            email: "",
            phone: "",
            gender: "",
            dob: "",
            isFreelance: false,
            role: {
                name: "",
                uuid: "",
            }
        } : state.user
    }))
}))
