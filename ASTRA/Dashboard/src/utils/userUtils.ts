export const isUserLoggedIn = (): boolean => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const idToken = localStorage.getItem("id_token");

    return accessToken !== null && refreshToken !== null && idToken !== null;
};


