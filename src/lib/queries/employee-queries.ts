import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";
import { CreateEmployeeHistoryPayload, CreateEmployeePayload, UpdateEmployeePayload } from "../interfaces/employee-interface";


const employee = {
    useCreateEmployee: () => {
        const [isCreatingEmployee, setIsCreatingEmployee] = useState(false);
        const createEmployee = useCallback(async (employeeData: CreateEmployeePayload) => {
            setIsCreatingEmployee(true);
            try {
                const formattedEmployee = await api.createEmployee(employeeData);
                return formattedEmployee;
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsCreatingEmployee(false);
            }
        }, []);
        return { createEmployee, isCreatingEmployee };
    },
    useCreateEmployeeHistory: () => {
        const [isCreatingEmployeeHistory, setIsCreatingEmployeeHistory] = useState(false);
        const createEmployeeHistory = useCallback(async (employeeHistoryData: CreateEmployeeHistoryPayload) => {
            setIsCreatingEmployeeHistory(true);
            try {
                await api.createEmployeeHistory(employeeHistoryData);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsCreatingEmployeeHistory(false);
            }
        }, []);
        return { createEmployeeHistory, isCreatingEmployeeHistory };
    },
    useGetEmployeeByCompanyUuid: (companyUuid: string) => {
        const [isFetchingEmployee, setIsFetchingEmployee] = useState(false);
        const fetchEmployee = useCallback(async () => {
            setIsFetchingEmployee(true);
            try {
                await api.getEmployeeByCompanyUuid(companyUuid);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsFetchingEmployee(false);
            }
        }, [companyUuid])
        useEffect(() => {
            fetchEmployee().catch((error) => console.error(error))
        }, [fetchEmployee])
        return { fetchEmployee, isFetchingEmployee };
    },
    useUpdateEmployeeByUuid: () => {
        const [isUpdatingEmployee, setIsUpdatingEmployee] = useState(false);
        const updateEmployee = useCallback(async (employeeUuid: string, employeeData: UpdateEmployeePayload) => {
            setIsUpdatingEmployee(true);
            try {
                await api.updateEmployeeByUuid(employeeUuid, employeeData);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsUpdatingEmployee(false);
            }
        }, []);
        return { updateEmployee, isUpdatingEmployee };
    }
}

export default employee