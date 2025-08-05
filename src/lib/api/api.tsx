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
import {
  BranchPayload,
  DivisionPayload,
  SubDivisionPayload,
} from "../interfaces/company-interface";
import patchAPI from "./patchAPI";
import deleteAPI from "./deleteAPI";
import { UpdateUserPayload } from "../interfaces/user-interface";

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
  async updateUser(data: UpdateUserPayload, userUuid: string) {
    try {
      const updateUser = useUserStore.getState().updateUser;
      const response = await patchAPI(data, `${API_URL.updateUser}${userUuid}`);
      if (response.status === 200) {
        const formattedData = responseFormatter.formatUpdateUser(response.data.data)
        updateUser(formattedData);
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getCompanyByUserUuid(userUuid: string, useSetterCurrentCompany: boolean) {
    try {
      const setAddCompany = useCompanyStore.getState().setAddCompany;
      const setCurrentCompany = useCompanyStore.getState().setCurrentCompany
      const response = await getAPI(
        `${API_URL.getCompanyByUserUuid}${userUuid}`
      );
      const formattedCompanyData =
        responseFormatter.formatGetCompanyByUserUuid(response);
      setAddCompany(formattedCompanyData);
      if (useSetterCurrentCompany) {
        setCurrentCompany(formattedCompanyData);
      }
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
        await responseFormatter.formatGetBranchesByCompanyUuid(response);
      setBranches(formattedBranches);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async createBranch(BranchPayload: BranchPayload) {
    try {
      const response = await postAPI(
        BranchPayload,
        `${API_URL.createBranchByCompanyUuid}`
      );
      if (response.status === 201) {
        await api.getBranchesByCompanyUuid(BranchPayload.company_uuid);
      } else {
        throw new Error("Failed to create branch");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async updateBranch(branchUuid: string, BranchPayload: BranchPayload) {
    try {
      // Extract only the path after '/branch-images/' if image is a signed URL
      let image = BranchPayload.image || "";
      if (image.includes("/branch-images/")) {
        // If it's a signed URL, extract the path
        const match = image.match(/(?:\/|^)branch-images\/[\w\-_.]+/);
        if (match) {
          image = match[0];
        }
      }
      const response = await patchAPI(
        {
          ...BranchPayload,
          image,
        },
        `${API_URL.updateBranchByUuid}${branchUuid}`
      );
      if (response.status === 200) {
        await api.getBranchesByCompanyUuid(BranchPayload.company_uuid);
      } else {
        throw new Error("Failed to update branch");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteBranch(branchUuid: string) {
    try {
      const response = await deleteAPI(
        {},
        `${API_URL.deleteBranchByUuid}${branchUuid}`
      );
      if (response.status === 200) {
        await api.getBranchesByCompanyUuid(
          useCompanyStore.getState().currentCompany?.uuid || ""
        );
      } else {
        throw new Error("Failed to delete branch");
      }
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
  async createDivision(payload: DivisionPayload) {
    try {
      const addDivision = useCompanyStore.getState().addDivision;
      const response = await postAPI(
        payload,
        `${API_URL.createDivisionByCompanyUuid}`
      );
      if (response.status === 201) {
        const formattedDivision =
          responseFormatter.formatCreateDivisionResponse(response.data);
        addDivision(formattedDivision);
        return formattedDivision;
      } else {
        throw new Error("Failed to create division");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async updateDivision(divisionUuid: string, payload: DivisionPayload) {
    try {
      const updateDivision = useCompanyStore.getState().updateDivision;
      const response = await patchAPI(
        payload,
        `${API_URL.updateDivisionByUuid}${divisionUuid}`
      );
      if (response.status === 200) {
        const formattedDivision =
          responseFormatter.formatUpdateDivisionResponse(response.data);
        updateDivision(divisionUuid, formattedDivision);
        return formattedDivision;
      } else {
        throw new Error("Failed to update division");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteDivision(divisionUuid: string) {
    try {
      const removeDivision = useCompanyStore.getState().removeDivision;
      const response = await deleteAPI(
        {},
        `${API_URL.deleteDivisionByUuid}${divisionUuid}`
      );
      if (response.status === 200) {
        removeDivision(divisionUuid);
        return true;
      } else {
        throw new Error("Failed to delete division");
      }
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
  async createSubDivision(payload: SubDivisionPayload) {
    try {
      const addSubDivision = useCompanyStore.getState().addSubDivision;
      const response = await postAPI(
        payload,
        `${API_URL.createSubDivisionByCompanyUuid}`
      );
      if (response.status === 201) {
        const formattedSubDivision =
          responseFormatter.formatCreateSubDivisionResponse(response.data);
        addSubDivision(formattedSubDivision);
        return formattedSubDivision;
      } else {
        throw new Error("Failed to create sub-division");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async updateSubDivision(
    subDivisionUuid: string,
    payload: SubDivisionPayload
  ) {
    try {
      const updateSubDivision = useCompanyStore.getState().updateSubDivision;
      const response = await patchAPI(
        payload,
        `${API_URL.updateSubDivisionByUuid}${subDivisionUuid}`
      );
      if (response.status === 200) {
        const formattedSubDivision =
          responseFormatter.formatUpdateSubDivisionResponse(response.data);
        updateSubDivision(subDivisionUuid, formattedSubDivision);
        return formattedSubDivision;
      } else {
        throw new Error("Failed to update sub-division");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteSubDivision(subDivisionUuid: string) {
    try {
      const removeSubDivision = useCompanyStore.getState().removeSubDivision;
      const response = await deleteAPI(
        {},
        `${API_URL.deleteSubDivisionByUuid}${subDivisionUuid}`
      );
      if (response.status === 200) {
        removeSubDivision(subDivisionUuid);
        return true;
      } else {
        throw new Error("Failed to delete sub-division");
      }
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
      } else {
        throw new Error("Failed to create employee");
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },
  async assignEmployeeToSubDivision(userUuid: string, data: { uuid: string; name: string; }) {
    const updateEmployee = useEmployeeStore.getState().updateEmployee;
    try {
      const response = await patchAPI({ department_uuid: data.uuid }, `${API_URL.assignEmployeeToSubDivision}${userUuid}`);
      if (response.status === 200) {
        updateEmployee({
          user_uuid: userUuid,
          subDivision: {
            uuid: data.uuid,
            name: data.name,
          },
        });
      } else {
        throw new Error("Failed to assign employee to sub-division");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async removeEmployeeFromSubDivision(userUuid: string, departmentUuid: string) {
    const updateEmployee = useEmployeeStore.getState().updateEmployee;
    try {
      const response = await patchAPI({ department_uuid: departmentUuid }, `${API_URL.unassignEmployeeFromSubDivision}${userUuid}`);
      if (response.status === 200) {
        updateEmployee({
          user_uuid: userUuid,
          subDivision: undefined,
        });
      } else {
        throw new Error("Failed to unassign employee from sub-division");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async terminateUser(userUuid: string, companyUuid: string, reason: string) {
    const { removeEmployee, addTerminatedEmployee, employees } =
      useEmployeeStore.getState();
    try {
      const url = reason
        ? `${API_URL.terminateUser}${userUuid}?company_uuid=${companyUuid}&reason=${reason}`
        : `${API_URL.terminateUser}${userUuid}?company_uuid=${companyUuid}`;
      const response = await deleteAPI({}, url);
      if (response.status === 200) {
        const employee = employees.find((e) => e.user_uuid === userUuid);
        if (employee) {
          addTerminatedEmployee({
            ...employee,
            termination: { date: new Date().toISOString(), reason },
          });
        }
        removeEmployee(userUuid);
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async rehireUser(userUuid: string, companyUuid: string) {
    const rehireEmployee = useEmployeeStore.getState().rehireEmployee;
    try {
      const url = `${API_URL.rehireUserByUuid}${userUuid}?company_uuid=${companyUuid}`;
      const response = await patchAPI({}, url);
      if (response.status === 200) {
        rehireEmployee(userUuid);
      } else {
        throw new Error(response.data.message || "Failed to rehire user");
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
      const setTerminatedEmployees =
        useEmployeeStore.getState().setTerminatedEmployees;
      const query = companyUuid
        ? `?company_uuid=${companyUuid}&limit=50`
        : "?limit=50";
      const response = await getAPI(
        `${API_URL.getEmployeeByCompanyUuid}${query}`
      );
      const formattedEmployees =
        responseFormatter.formatGetEmployeeByCompanyUuid(response);

      const activeEmployees = formattedEmployees.filter(
        (emp) => !emp.termination
      );
      const terminatedEmployees = formattedEmployees.filter(
        (emp) => emp.termination
      );
      setEmployees(activeEmployees);
      setTerminatedEmployees(terminatedEmployees);
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
      const response = await patchAPI(
        employeeData,
        `${API_URL.updateEmployeeByUuid}${employeeUuid}`
      );
      if (response.status === 200) {
        const formattedEmployee =
          responseFormatter.formatUpdateEmployeeResponse(response.data);
        updateEmployee(formattedEmployee);
      } else {
        throw new Error("Failed to update employee");
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
