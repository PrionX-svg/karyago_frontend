import { useState, useCallback, useEffect } from "react";
import { api } from "../api/api";

const company = {
    useGetCompanyByUserUuid: (userUuid: string) => {
        const [isFetchingCompany, setIsFetchingCompany] = useState(false);

        const fetchCompanyByUserUuid = useCallback(async () => {
            setIsFetchingCompany(true);
            if (!userUuid) {
                return;
            }
            try {
                return await api.getCompanyByUserUuid(userUuid);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsFetchingCompany(false);
            }
        }, [userUuid])

        useEffect(() => {
            fetchCompanyByUserUuid().catch((error) => console.error(error))
        }, [fetchCompanyByUserUuid])

        return { fetchCompanyByUserUuid, isFetchingCompany }
    },
    useGetBranchesByCompanyUuid: (companyUuid: string) => {
        const [isFetchingBranches, setIsFetchingBranches] = useState(false);

        const fetchBranchesByCompanyUuid = useCallback(async () => {
            setIsFetchingBranches(true);
            if (!companyUuid) {
                return;
            }
            try {
                return await api.getBranchesByCompanyUuid(companyUuid);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsFetchingBranches(false);
            }
        }, [companyUuid])

        useEffect(() => {
            fetchBranchesByCompanyUuid().catch((error) => console.error(error))
        }, [fetchBranchesByCompanyUuid])

        return { fetchBranchesByCompanyUuid, isFetchingBranches }
    },
    useGetDivisions: (companyUuid: string) => {
        const [isFetchingDivisions, setIsFetchingDivisions] = useState(false);

        const fetchDivisions = useCallback(async () => {
            setIsFetchingDivisions(true);
            if (!companyUuid) {
                return;
            }
            try {
                return await api.getDivisionsByCompanyUuid(companyUuid);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsFetchingDivisions(false);
            }
        }, [companyUuid])

        useEffect(() => {
            fetchDivisions().catch((error) => console.error(error))
        }, [fetchDivisions])

        return { fetchDivisions, isFetchingDivisions }
    },
    useGetSubDivisions: (companyUuid: string) => {
        const [isFetchingSubDivisions, setIsFetchingSubDivisions] = useState(false);

        const fetchSubDivisions = useCallback(async () => {
            setIsFetchingSubDivisions(true);
            if (!companyUuid) {
                return;
            }
            try {
                return await api.getSubDivisionsByCompanyUuid(companyUuid);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsFetchingSubDivisions(false);
            }
        }, [companyUuid])

        useEffect(() => {
            fetchSubDivisions().catch((error) => console.error(error))
        }, [fetchSubDivisions])

        return { fetchSubDivisions, isFetchingSubDivisions }
    }
}

export default company;