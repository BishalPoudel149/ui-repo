export const authConfig = {
  tokenUrl: "https://aztwzrclb.trial-accounts.ondemand.com/oauth2/token",
  clientId: "ae1b718c-172b-4800-b72a-5daaa2a4952b",
  clientSecret: "3dAbrH9Yw=rfD_7YVf-RJdg34_HEqsv",
  redirectUri: process.env.NODE_ENV === 'production' 
    ? "https://astra-daring-gelada-kk.cfapps.us10-001.hana.ondemand.com/login" 
    : "http://localhost:5173/login",
  userInfoUrl: "https://aztwzrclb.trial-accounts.ondemand.com/oauth2/userinfo",
  authUrl: "https://aztwzrclb.trial-accounts.ondemand.com/oauth2/authorize",
  logoutUrl: "https://aztwzrclb.trial-accounts.ondemand.com/oauth2/logout"
};
