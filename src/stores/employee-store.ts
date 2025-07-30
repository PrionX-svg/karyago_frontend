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
    updateTerminatedEmployee: (employeeUpdate: Partial<EmployeeType> & { user_uuid: string }) => void;
    updateEmployeeHistory: (employeeHistory: EmployeeHistoryType) => void;

    removeEmployee: (uuid: string) => void;
    removeEmployeeHistory: (uuid: string) => void;

    terminateEmployee: (uuid: string) => void;
    rehireEmployee: (uuid: string) => void;
};

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
    employees: [],
    terminatedEmployees: [],
    employeeHistory: [],

    setEmployees: (employees) => set({ employees }),
    setTerminatedEmployees: (employees) => set({ terminatedEmployees: employees }),
    setEmployeeHistory: (employeeHistory) => set({ employeeHistory }),

    addEmployee: (employee) =>
        set((state) => ({ employees: [employee, ...state.employees] })),
    addTerminatedEmployee: (employee) =>
        set((state) => ({ terminatedEmployees: [employee, ...state.terminatedEmployees] })),
    addEmployeeHistory: (employeeHistory) =>
        set((state) => ({
            employeeHistory: [employeeHistory, ...state.employeeHistory],
        })),

    updateEmployee: (employeeUpdate) =>
        set((state) => ({
            employees: state.employees.map((emp) =>
                emp.user_uuid === employeeUpdate.user_uuid
                    ? { ...emp, ...employeeUpdate }
                    : emp
            ),
        })),
    updateTerminatedEmployee: (employeeUpdate) =>
        set((state) => ({
            terminatedEmployees: state.terminatedEmployees.map((emp) =>
                emp.user_uuid === employeeUpdate.user_uuid
                    ? { ...emp, ...employeeUpdate }
                    : emp
            ),
        })),
    updateEmployeeHistory: (employeeHistory) =>
        set((state) => ({
            employeeHistory: state.employeeHistory.map((history) =>
                history.uuid === employeeHistory.uuid
                    ? employeeHistory
                    : history
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

    terminateEmployee: (uuid) => {
        const state = get();
        const employee = state.employees.find((e) => e.user_uuid === uuid);
        if (employee) {
            set({
                employees: state.employees.filter((e) => e.user_uuid !== uuid),
                terminatedEmployees: [employee, ...state.terminatedEmployees],
            });
        }
    },

    rehireEmployee: (uuid) => {
        const state = get();
        const employee = state.terminatedEmployees.find((e) => e.user_uuid === uuid);

        if (employee) {
            const updatedEmployee = { ...employee, termination: undefined };

            set({
                terminatedEmployees: state.terminatedEmployees.filter(
                    (e) => e.user_uuid !== uuid
                ),
                employees: [updatedEmployee, ...state.employees],
            });
        }
    },


}));               
