import { useState, useCallback, useEffect } from "react";
import { api } from "../api/api";
import { BranchPayload } from "../interfaces/company-interface";

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
    }, [userUuid]);

    useEffect(() => {
      fetchCompanyByUserUuid().catch((error) => console.error(error));
    }, [fetchCompanyByUserUuid]);

    return { fetchCompanyByUserUuid, isFetchingCompany };
  },
  useGetCompanyByUuid: (companyUuid: string) => {
    const [isFetchingCompany, setIsFetchingCompany] = useState(false);

    const fetchCompanyByUuid = useCallback(async () => {
      setIsFetchingCompany(true);
      if (!companyUuid) {
        return;
      }
      try {
        return await api.getCompanyByUuid(companyUuid);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setIsFetchingCompany(false);
      }
    }, [companyUuid]);

    useEffect(() => {
      fetchCompanyByUuid().catch((error) => console.error(error));
    }, [fetchCompanyByUuid]);

    return { fetchCompanyByUuid, isFetchingCompany };
  },
  useGetCompaniesByUserUuid: () => {
    const [isFetchingCompanies, setIsFetchingCompanies] = useState(false);

    const fetchCompaniesByUserUuid = useCallback(async (userUuid: string) => {
      setIsFetchingCompanies(true);
      if (!userUuid) {
        return;
      }
      try {
        return await api.getCompaniesByUserUuid(userUuid);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setIsFetchingCompanies(false);
      }
    }, []);

    return { fetchCompaniesByUserUuid, isFetchingCompanies };
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
    }, [companyUuid]);

    useEffect(() => {
      fetchBranchesByCompanyUuid().catch((error) => console.error(error));
    }, [fetchBranchesByCompanyUuid]);

    return { fetchBranchesByCompanyUuid, isFetchingBranches };
  },
  useCreateBranch: (branchPayload: BranchPayload) => {
    const [isCreatingBranch, setIsCreatingBranch] = useState(false);

    const createBranch = useCallback(async () => {
      setIsCreatingBranch(true);
      if (!branchPayload) {
        return;
      }
      try {
        return await api.createBranch(branchPayload);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setIsCreatingBranch(false);
      }
    }, [branchPayload]);
    return { createBranch, isCreatingBranch };
  },
  useUpdateBranch: (branchUuid: string) => {
    const [isUpdatingBranch, setIsUpdatingBranch] = useState(false);

    const updateBranch = useCallback(
      async (branchPayload: BranchPayload) => {
        setIsUpdatingBranch(true);
        if (!branchUuid || !branchPayload) {
          return;
        }
        try {
          return await api.updateBranch(branchUuid, branchPayload);
        } catch (error) {
          return Promise.reject(error);
        } finally {
          setIsUpdatingBranch(false);
        }
      },
      [branchUuid]
    );
    return { updateBranch, isUpdatingBranch };
  },
  useDeleteBranch: (branchUuid: string) => {
    const [isDeletingBranch, setIsDeletingBranch] = useState(false);

    const deleteBranch = useCallback(async () => {
      setIsDeletingBranch(true);
      if (!branchUuid) {
        return;
      }
      try {
        return await api.deleteBranch(branchUuid);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setIsDeletingBranch(false);
      }
    }, [branchUuid]);
    return { deleteBranch, isDeletingBranch };
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
    }, [companyUuid]);

    useEffect(() => {
      fetchDivisions().catch((error) => console.error(error));
    }, [fetchDivisions]);

    return { fetchDivisions, isFetchingDivisions };
  },
  useDeleteDivision: (divisionUuid: string) => {
    const [isDeletingDivision, setIsDeletingDivision] = useState(false);

    const deleteDivision = useCallback(async () => {
      setIsDeletingDivision(true);
      if (!divisionUuid) {
        return;
      }
      try {
        return await api.deleteDivision(divisionUuid);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        setIsDeletingDivision(false);
      }
    }, [divisionUuid]);

    return { deleteDivision, isDeletingDivision };
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
    }, [companyUuid]);

    useEffect(() => {
      fetchSubDivisions().catch((error) => console.error(error));
    }, [fetchSubDivisions]);

    return { fetchSubDivisions, isFetchingSubDivisions };
  },
};

export default company;
