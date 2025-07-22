export const API_URL = {
    login: "/auth/login",
    register: "/auth/register",
    getMe: "/users/@me",
    getCompanyByUserUuid: "/companies/get-by-user/",
    getBranchesByCompanyUuid: "/branches/get-by-company-uuid/",
    getDivisionsByCompanyUuid: "/department-groups/get-all/dt",
    getSubDivisionsByCompanyUuid: "/departments/get-all/dt",
    createEmployeeByCompanyUuid: "/users/create",
    importEmployee: "/users/import",
    createEmployeeHistory: "/employment-histories/create",
    getEmployeeByCompanyUuid: "/users/get-all/dt",
    updateEmployeeByUuid: "/users/update/",
    exportEmployeeToExcel: "/users/export",
    getRolesByCompanyUuid: "/roles/get-all/dt"
}