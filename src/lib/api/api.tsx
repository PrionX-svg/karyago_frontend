import { useUserStore } from "@/stores/user-store"
import getAPI from "./getAPI";
import { API_URL } from "./constants";
import { responseFormatter } from "./responseFormatter";
import { useCompanyStore } from "@/stores/company-store";
import { useEmployeeStore } from "@/stores/employee-store";

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
            const setAddCompany = useCompanyStore.getState().setAddCompany;
            const response = await getAPI(`${API_URL.getCompanyByUserUuid}${userUuid}`);
            const formattedCompanyData = responseFormatter.formatGetCompanyByUserUuid(response)
            setAddCompany(formattedCompanyData);
        } catch (error) {
            return Promise.reject(error)
        }
    },
    async getBranchesByCompanyUuid(companyUuid: string) {
        try {
            const setBranches = useCompanyStore.getState().setCompanyBranch;
            const response = await getAPI(`${API_URL.getBranchesByCompanyUuid}${companyUuid}`);
            const formattedBranches = responseFormatter.formatGetBranchesByCompanyUuid(response)
            setBranches(formattedBranches);
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
    async getSubDivisionsByCompanyUuid(companyUuid: string) {
        try {
            const setSubDivisions = useCompanyStore.getState().setSubDivision;
            const query = companyUuid ? `?company_uuid=${companyUuid}&limit=50` : "?limit=50";
            const response = await getAPI(`${API_URL.getSubDivisionsByCompanyUuid}${query}`);
            const formattedSubDivisions = responseFormatter.formatGetSubDivisionsByCompanyUuid(response)
            setSubDivisions(formattedSubDivisions);
        } catch (error) {
            return Promise.reject(error)
        }
    },
    // async createEmployee(employeeData: EmployeeType) {
    //     try {
    //         const addEmployee = useEmployeeStore.getState().addEmployee;
    //         const response = await postAPI(employeeData, `${API_URL.createEmployeeByCompanyUuid}`);
    //         const formattedEmployee = responseFormatter.formatCreateEmployee(response);
    //         addEmployee(formattedEmployee);
    //     } catch (error) {
    //         return Promise.reject(error)
    //     }
    // },
    async getEmployeeByCompanyUuid(companyUuid: string) {
        try{
            const setEmployees = useEmployeeStore.getState().setEmployees;
            const query = companyUuid ? `?company_uuid=${companyUuid}&limit=50` : "?limit=50";
            const response = await getAPI(`${API_URL.getEmployeeByCompanyUuid}${query}`);
            const formattedEmployees = responseFormatter.formatGetEmployeeByCompanyUuid(response)
            setEmployees(formattedEmployees);
        } catch (error) {
            return Promise.reject(error)
        }
    }
}