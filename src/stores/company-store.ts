import { CompanyBranchType, CompanyType, DivisionType, SubDivisionType } from "@/lib/types/company-type";
import { create } from "zustand";

type CompanyStore = {
    company: CompanyType[];
    companyBranch: CompanyBranchType[];
    division: DivisionType[];
    subDivision: SubDivisionType[];
    setCompany: (company: CompanyType[]) => void;
    setAddCompany: (company: CompanyType) => void;
    setCompanyBranch: (branch: CompanyBranchType[]) => void;
    addCompanyBranch: (branch: CompanyBranchType) => void;
    setDivision: (division: DivisionType[]) => void;
    addDivision: (division: DivisionType) => void;
    setSubDivision: (subDivision: SubDivisionType[]) => void;
    addSubDivision: (subDivision: SubDivisionType) => void;
    removeCompany: (uuid: string) => void;
    removeCompanyBranch: (uuid: string) => void;
    removeDivision: (uuid: string) => void;
    removeSubDivision: (uuid: string) => void;
};

export const useCompanyStore = create<CompanyStore>((set) => ({
    company: [],
    companyBranch: [],
    division: [],
    subDivision: [],
    setCompany: (company) => set({ company }),
    setAddCompany: (company) =>
        set((state) => ({ company: [...state.company, company] })),
    setCompanyBranch: (branch) => set({ companyBranch: branch }),
    addCompanyBranch: (branch) =>
        set((state) => ({ companyBranch: [...state.companyBranch, branch] })),
    setDivision: (division) => set({ division }),
    addDivision: (division) =>
        set((state) => ({ division: [...state.division, division] })),
    setSubDivision: (subDivision) => set({ subDivision }),
    addSubDivision: (subDivision) =>
        set((state) => ({ subDivision: [...state.subDivision, subDivision] })),
    removeCompany: (uuid) =>
        set((state) => ({
            company: state.company.filter((company) => company.uuid !== uuid),
        })),
    removeCompanyBranch: (uuid) =>
        set((state) => ({
            companyBranch: state.companyBranch.filter(
                (branch) => branch.uuid !== uuid
            ),
        })),
    removeDivision: (uuid) =>
        set((state) => ({
            division: state.division.filter((division) => division.uuid !== uuid),
        })),
    removeSubDivision: (uuid) =>
        set((state) => ({
            subDivision: state.subDivision.filter(
                (subDivision) => subDivision.uuid !== uuid
            ),
        })),
}));
