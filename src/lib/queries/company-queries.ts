// import { useCallback, useEffect, useState } from "react"
// import { api } from "../api/api";

const companies = {
    // useGetAllCompanies: () => {
    //     const [isFetchingAllCompanies, setIsFetchingAllCompanies] = useState(false);

    //     const fetchAllCompanies = useCallback(async () => {
    //         setIsFetchingAllCompanies(true);
    //         try {
    //             await api.getAllCompanies();
    //         } catch (error) {
    //             return Promise.reject(error);
    //         } finally {
    //             setIsFetchingAllCompanies(false);
    //         }
    //     }, []);

    //     useEffect(() => {
    //         fetchAllCompanies().catch((error) => console.error(error))
    //     }, [fetchAllCompanies]) 

    //     return { fetchAllCompanies, isFetchingAllCompanies };
    // }
}

export default companies;