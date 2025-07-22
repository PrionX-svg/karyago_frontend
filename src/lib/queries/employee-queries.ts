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
    useImportEmployee: () => {
        const [isImportingEmployee, setIsImportingEmployee] = useState(false)
        const importEmployee = useCallback(async (formData: FormData) => {
            setIsImportingEmployee(true)
            try {
                await api.importEmployee(formData)
            } catch (error) {
                return Promise.reject(error)
            } finally {
                setIsImportingEmployee(false)
            }
        }, [])
        return { isImportingEmployee, importEmployee }
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
    },
    useExportExcel: () => {
        const [isExportingExcel, setIsExportingExcel] = useState(false);
        const exportExcel = useCallback(async (companyUuid: string) => {
            setIsExportingExcel(true);
            try {
                const response = await api.exportEmployeeToExcel(companyUuid);
                return response;
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsExportingExcel(false);
            }
        }, []);
        return { exportExcel, isExportingExcel };
    }
}

export default employee