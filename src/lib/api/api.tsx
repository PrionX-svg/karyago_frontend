import { useUserStore } from "@/stores/user-store";
import getAPI from "./getAPI";
import { API_URL } from "./constants";
import { responseFormatter } from "./responseFormatter";
import { useCompanyStore } from "@/stores/company-store";
import { useEmployeeStore } from "@/stores/employee-store";
import {
  CreateEmployeeHistoryPayload,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "../interfaces/employee-interface";
import postAPI from "./postAPI";
import { useRoleStore } from "@/stores/role-store";

export const api = {
  async getMe() {
    try {
      const setUserInfo = useUserStore.getState().setUser;
      const response = await getAPI(`${API_URL.getMe}`);
      const formattedUserData = responseFormatter.formatUserData(response);
      setUserInfo(formattedUserData);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getCompanyByUserUuid(userUuid: string) {
    try {
      const setAddCompany = useCompanyStore.getState().setAddCompany;
      const response = await getAPI(
        `${API_URL.getCompanyByUserUuid}${userUuid}`
      );
      const formattedCompanyData =
        responseFormatter.formatGetCompanyByUserUuid(response);
      setAddCompany(formattedCompanyData);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getCompanyByUuid(companyUuid: string) {
    try {
      const setCurrentCompany = useCompanyStore.getState().setCurrentCompany;
      const response = await getAPI(
        `${API_URL.getCompanyByUuid}${companyUuid}`
      );
      const formattedCompanyData =
        responseFormatter.formatGetCompanyByUuid(response);
      setCurrentCompany(formattedCompanyData);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getCompaniesByUserUuid(userUuid: string) {
    try {
      const setCompanies = useCompanyStore.getState().setCompany;
      const response = await getAPI(
        `${API_URL.getCompaniesByUserUuid}${userUuid}`
      );
      const formattedCompaniesData =
        responseFormatter.formatGetCompaniesByUserUuid(response);
      setCompanies(formattedCompaniesData);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getBranchesByCompanyUuid(companyUuid: string) {
    try {
      const setBranches = useCompanyStore.getState().setCompanyBranch;
      const response = await getAPI(
        `${API_URL.getBranchesByCompanyUuid}${companyUuid}`
      );
      const formattedBranches =
        responseFormatter.formatGetBranchesByCompanyUuid(response);
      setBranches(formattedBranches);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getDivisionsByCompanyUuid(companyUuid: string) {
    try {
      const setDivisions = useCompanyStore.getState().setDivision;
      const query = companyUuid
        ? `?company_uuid=${companyUuid}&limit=50`
        : "?limit=50";
      const response = await getAPI(
        `${API_URL.getDivisionsByCompanyUuid}${query}`
      );
      const formattedDivisions =
        responseFormatter.formatGetDivisionsByCompanyUuid(response);
      setDivisions(formattedDivisions);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getSubDivisionsByCompanyUuid(companyUuid: string) {
    try {
      const setSubDivisions = useCompanyStore.getState().setSubDivision;
      const query = companyUuid
        ? `?company_uuid=${companyUuid}&limit=50`
        : "?limit=50";
      const response = await getAPI(
        `${API_URL.getSubDivisionsByCompanyUuid}${query}`
      );
      const formattedSubDivisions =
        responseFormatter.formatGetSubDivisionsByCompanyUuid(response);
      setSubDivisions(formattedSubDivisions);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async createEmployee(employeeData: CreateEmployeePayload) {
    const addEmployee = useEmployeeStore.getState().addEmployee;
    try {
      const response = await postAPI(
        employeeData,
        `${API_URL.createEmployeeByCompanyUuid}`
      );
      if (response.status === 201) {
        const formattedEmployee =
          responseFormatter.formatCreateEmployeeResponse(response.data);
        addEmployee(formattedEmployee);
        return formattedEmployee;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async createEmployeeHistory(
    employeeHistoryData: CreateEmployeeHistoryPayload
  ) {
    const addEmployeeHistory = useEmployeeStore.getState().addEmployeeHistory;
    try {
      const response = await postAPI(
        employeeHistoryData,
        `${API_URL.createEmployeeHistory}`
      );
      if (response.status === 201) {
        const formattedEmployeeHistory =
          responseFormatter.formatCreateEmployeeHistoryResponse(response.data);
        addEmployeeHistory(formattedEmployeeHistory);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async importEmployee(formData: FormData) {
    const setEmployee = useEmployeeStore.getState().setEmployees;
    const setEmployeeHistory = useEmployeeStore.getState().setEmployeeHistory;
    try {
      const response = await postAPI(formData, `${API_URL.importEmployee}`);
      if (response.status === 200) {
        const employeesData = responseFormatter.formatImportEmployeeData(
          response.data
        );
        const employeeHistoryData =
          responseFormatter.formatImportEmployeeHistoryData(response.data);
        setEmployee(employeesData);
        setEmployeeHistory(employeeHistoryData);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getEmployeeByCompanyUuid(companyUuid: string) {
    try {
      const setEmployees = useEmployeeStore.getState().setEmployees;
      const query = companyUuid
        ? `?company_uuid=${companyUuid}&limit=50`
        : "?limit=50";
      const response = await getAPI(
        `${API_URL.getEmployeeByCompanyUuid}${query}`
      );
      const formattedEmployees =
        responseFormatter.formatGetEmployeeByCompanyUuid(response);
      setEmployees(formattedEmployees);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async updateEmployeeByUuid(
    employeeUuid: string,
    employeeData: UpdateEmployeePayload
  ) {
    try {
      const updateEmployee = useEmployeeStore.getState().updateEmployee;
      const response = await postAPI(
        employeeData,
        `${API_URL.updateEmployeeByUuid}${employeeUuid}`
      );
      if (response.status === 200) {
        const formattedEmployee =
          responseFormatter.formatUpdateEmployeeResponse(response.data);
        updateEmployee(formattedEmployee);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async exportEmployeeToExcel(companyUuid: string) {
    try {
      const query = companyUuid ? `?company_uuid=${companyUuid}` : "";
      const blob = await getAPI(
        `${API_URL.exportEmployeeToExcel}${query}`,
        "blob"
      );
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employees.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getRolesByCompanyUuid(companyUuid: string) {
    try {
      const setRoles = useRoleStore.getState().setRoles;
      const query = companyUuid
        ? `?company_uuid=${companyUuid}&limit=50`
        : "?limit=50";
      const response = await getAPI(`${API_URL.getRolesByCompanyUuid}${query}`);
      const formattedRoles = responseFormatter.formatGetRolesByCompanyUuid(
        response.data
      );
      setRoles(formattedRoles);
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
