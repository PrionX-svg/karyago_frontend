import { useUserStore } from "@/stores/user-store"
import getAPI from "./getAPI";
import { API_URL } from "./constants";
import { responseFormatter } from "./responseFormatter";
import { useCompanyStore } from "@/stores/company-store";

export const api = {
    async getMe() {
        try {
            const setUserInfo = useUserStore.getState().setUser;
            const response = await getAPI(`${API_URL.getMe}`);
            const formattedUserData = responseFormatter.formatUserData(response)
            setUserInfo(formattedUserData);
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async getCompanyByUserUuid(userUuid: string) {
        try {
            // const setCompany = useCompanyStore.getState().setCompany;
            const response = await getAPI(`${API_URL.getCompanyByUserUuid}${userUuid}`);
            console.log("Company response:", response);
            // const formattedCompanyData = responseFormatter.formatGetCompanyByUserUuid(response)
            // setCompany(formattedCompanyData);
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async getDivisionsByCompanyUuid(companyUuid: string) {
        try {
            const setDivisions = useCompanyStore.getState().setDivision;
            const query = companyUuid ? `?company_uuid=${companyUuid}&limit=50` : "?limit=50";
            const response = await getAPI(`${API_URL.getDivisionsByCompanyUuid}${query}`);
            const formattedDivisions = responseFormatter.formatGetDivisionsByCompanyUuid(response)
            setDivisions(formattedDivisions);
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async getSubDivisionsByCompanyUuid(companyUuid: string){
        try {
            const setSubDivisions = useCompanyStore.getState().setSubDivision;
            const query = companyUuid ? `?company_uuid=${companyUuid}&limit=50` : "?limit=50";
            const response = await getAPI(`${API_URL.getSubDivisionsByCompanyUuid}${query}`);
            const formattedSubDivisions = responseFormatter.formatGetSubDivisionsByCompanyUuid(response)
            setSubDivisions(formattedSubDivisions);
        } catch (error) {
            return Promise.reject(error)
        }
    } 
}