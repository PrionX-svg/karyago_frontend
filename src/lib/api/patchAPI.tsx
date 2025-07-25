const patchAPI = async (data: unknown, url: string) => {
    const headers: HeadersInit = {};
    let body: BodyInit;

    if (data instanceof FormData) {
        body = data;
    } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${url}`, {
            method: "PATCH",
            headers,
            credentials: "include",
            body,
        });

        if (!response.ok) {
            const errorContentType = response.headers.get("Content-Type");
            let errorData;

            if (errorContentType?.includes("application/json")) {
                errorData = await response.json().catch(() => ({}));
            } else {
                errorData = await response.text();
            }

            return {
                status: response.status,
                ok: false,
                data: errorData,
            };
        }

        const contentType = response.headers.get("Content-Type");
        let responseData;
        if (contentType?.includes("application/json")) {
            responseData = await response.json().catch(() => ({}));
        } else {
            responseData = await response.text();
        }

        return {
            status: response.status, // ✅ now TypeScript is happy
            data: responseData,
        };
    } catch (error) {
        throw error;
    }
};

export default patchAPI;