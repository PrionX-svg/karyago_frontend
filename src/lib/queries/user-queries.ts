import { useCallback, useEffect, useState } from "react";
import { api } from "../api/api";

const user = {
    useGetMe: () => {
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
    },
    useLogOut: () => {
        const [isLoggingOut, setIsLoggingOut] = useState(false);
        const userLogout = useCallback(async () => {
            setIsLoggingOut(true);
            try {
                await api.logout();
            } catch (error) {
                console.error("Logout failed:", error);
            } finally {
                setIsLoggingOut(false);
            }
        }, []);

        return { userLogout, isLoggingOut };
    },

}

export default user;