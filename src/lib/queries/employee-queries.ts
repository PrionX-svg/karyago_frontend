import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";


const employee = {
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
    }
}

export default employee