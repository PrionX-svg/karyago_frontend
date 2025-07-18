import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";

const roles = {
    useGetRolesByCompanyUuid: (companyUuid: string) => {
        const [isFetchingRoles, setIsFetchingRoles] = useState(false);
        const fetchRoles = useCallback(async () => {
            setIsFetchingRoles(true);
            if (!companyUuid) {
                return
            }
            try {
                await api.getRolesByCompanyUuid(companyUuid);
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsFetchingRoles(false);
            }
        }, [companyUuid]);
        useEffect(() => {
            fetchRoles().catch((error) => console.error(error));
        }, [fetchRoles]);
        return { fetchRoles, isFetchingRoles };
    }
}

export default roles;