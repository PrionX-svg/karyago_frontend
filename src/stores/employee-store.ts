import { EmployeeHistoryType, EmployeeType } from "@/lib/types/employee-type";
import { create } from "zustand";

type EmployeeStore = {
    employees: EmployeeType[];
    terminatedEmployees: EmployeeType[];
    employeeHistory: EmployeeHistoryType[];

    setEmployees: (employees: EmployeeType[]) => void;
    setTerminatedEmployees: (employees: EmployeeType[]) => void;

    addEmployee: (employee: EmployeeType) => void;
    addTerminatedEmployee: (employee: EmployeeType) => void;

    setEmployeeHistory: (employeeHistory: EmployeeHistoryType[]) => void;
    addEmployeeHistory: (employeeHistory: EmployeeHistoryType) => void;

    updateEmployee: (employeeUpdate: Partial<EmployeeType> & { user_uuid: string }) => void;
    updateEmployeeHistory: (employeeHistory: EmployeeHistoryType) => void;

    removeEmployee: (uuid: string) => void;
    removeEmployeeHistory: (uuid: string) => void;
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
    employees: [],
    terminatedEmployees: [],
    employeeHistory: [],

    setEmployees: (employees) => set({ employees }),
    setTerminatedEmployees: (employees) => set({ terminatedEmployees: employees }),

    addEmployee: (employee) =>
        set((state) => ({ employees: [employee, ...state.employees] })),
    addTerminatedEmployee: (employee) =>
        set((state) => ({ terminatedEmployees: [employee, ...state.terminatedEmployees] })),

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

    updateEmployee: (employeeUpdate: Partial<EmployeeType> & { user_uuid: string }) =>
        set((state) => ({
            employees: state.employees.map((emp) =>
                emp.user_uuid === employeeUpdate.user_uuid
                    ? { ...emp, ...employeeUpdate }
                    : emp
            ),
        })),

    removeEmployee: (uuid) =>
        set((state) => ({
            employees: state.employees.filter((employee) => employee.user_uuid !== uuid),
        })),

    removeEmployeeHistory: (uuid) =>
        set((state) => ({
            employeeHistory: state.employeeHistory.filter(
                (history) => history.uuid !== uuid
            ),
        })),
}));
