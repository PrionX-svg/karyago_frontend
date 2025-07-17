import { EmployeeHistoryType, EmployeeType } from "@/lib/types/employee-type";
import { create } from "zustand";

type EmployeeStore = {
    employees: EmployeeType[];
    employeeHistory: EmployeeHistoryType[];
    setEmployees: (employees: EmployeeType[]) => void;
    addEmployee: (employee: EmployeeType) => void;
    setEmployeeHistory: (employeeHistory: EmployeeHistoryType[]) => void;
    addEmployeeHistory: (employeeHistory: EmployeeHistoryType) => void;
    updateEmployee: (employee: EmployeeType) => void;
    updateEmployeeHistory: (employeeHistory: EmployeeHistoryType) => void;
    removeEmployee: (uuid: string) => void;
    removeEmployeeHistory: (uuid: string) => void;
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
    employees: [],
    employeeHistory: [],
    setEmployees: (employees) => set({ employees }),
    addEmployee: (employee) =>
        set((state) => ({ employees: [employee, ...state.employees] })),
    setEmployeeHistory: (employeeHistory) => set({ employeeHistory }),
    addEmployeeHistory: (employeeHistory) =>
        set((state) => ({
            employeeHistory: [employeeHistory, ...state.employeeHistory],
        })),
    updateEmployeeHistory: (employeeHistory) =>
        set((state) => ({
            employeeHistory: state.employeeHistory.map((history) =>
                history.uuid === employeeHistory.uuid
                    ? employeeHistory
                    : history
            ),
        })),
    updateEmployee: (employee) =>
        set((state) => ({
            employees: state.employees.map((emp) =>
                emp.user_uuid === employee.user_uuid ? employee : emp
            ),
        })),
    removeEmployee: (uuid) =>
        set((state) => ({
            employees: state.employees.filter((employee) => employee.company_uuid !== uuid),
        })),
    removeEmployeeHistory: (uuid) =>
        set((state) => ({
            employeeHistory: state.employeeHistory.filter(
                (history) => history.uuid !== uuid
            ),
        })),
}))