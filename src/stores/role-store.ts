import { RoleType } from "@/lib/types/role-type"
import { create } from "zustand";

type RoleStore = {
    roles: RoleType[];
    setRoles: (roles: RoleType[]) => void;
    addRole: (role: RoleType) => void;
    updateRole: (role: RoleType) => void;
    removeRole: (uuid: string) => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
    roles: [],
    setRoles: (roles) => set({ roles }),
    addRole: (role) => set((state) => ({ roles: [...state.roles, role] })),
    updateRole: (role) => set((state) => ({
        roles: state.roles.map((r) => (r.uuid === role.uuid ? role : r))
    })),
    removeRole: (uuid) => set((state) => ({
        roles: state.roles.filter((r) => r.uuid !== uuid)
    })),
}))
