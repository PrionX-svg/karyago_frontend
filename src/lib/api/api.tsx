import { useUserStore } from "@/stores/user-store"
import getAPI from "./getAPI";
import { API_URL } from "./constants";
import { responseFormatter } from "./responseFormatter";

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
    }
}