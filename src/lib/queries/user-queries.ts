import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";

const user = {
    useGetUMe: () => {
        const [isFetchingGetMe, setIsFetchingGetMe] = useState(false);

        const fetchGetMe = useCallback(async () => {
            setIsFetchingGetMe(true);
            try {
                await api.getMe();
            } catch (error) {
                return Promise.reject(error);
            } finally {
                setIsFetchingGetMe(false);
            }
        }, []);

        useEffect(() => {
            fetchGetMe().catch((error) => console.error(error))
        }, [fetchGetMe])

        return { fetchGetMe, isFetchingGetMe };
    }
}

export default user;