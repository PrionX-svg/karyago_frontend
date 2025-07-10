const getAPI = async (url: string, responseType: "json" | "blob" = "json") => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
    if (response.status === 401) {
        // Check if we're on a schedule page - if so, don't redirect
        const isSchedulePage =
            typeof window !== "undefined" &&
            /^\/(en|de|id)\/sch\/[^/]+/.test(window.location.pathname);

        if (isSchedulePage) {
            // For schedule pages, just throw the error without clearing cookies or redirecting
            console.log(
                `[getAPI] 401 on schedule page - not redirecting: ${window.location.pathname}`
            );
            throw new Error("Unauthorized access to schedule data");
        }

        console.log(
            `[getAPI] 401 on non-schedule page - clearing cookies and redirecting`
        );

        // Clear cookies
        document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.trim().split("=");
            if (name === "authOK") {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            }
        });

        window.location.reload();

        throw new Error(
            "Unauthorized! Cookies have been cleared. Please log in again."
        );
    }

    if (!response.ok) {
        return {
            status: response.status,
            data: null,
        };
    }

    return responseType === "blob" ? response.blob() : response.json();
};

export default getAPI;
