import { EmployeeType } from "@/lib/types/employee-type";
import { create } from "zustand";

type EmployeeStore = {
    employees: EmployeeType[];
    setEmployees: (employees: EmployeeType[]) => void;
    addEmployee: (employee: EmployeeType) => void;
    removeEmployee: (uuid: string) => void;
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
    employees: [],
    setEmployees: (employees) => set({ employees }),
    addEmployee: (employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),
    removeEmployee: (uuid) =>
        set((state) => ({
            employees: state.employees.filter((employee) => employee.company_uuid !== uuid),
        })),
}))