import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authConfig } from "../utils/authConfig";

export default function LoginPage() {
  const navigate = useNavigate();

  const exchangeCodeForToken = useCallback(async (authCode: string) => {
    const { tokenUrl, clientId, clientSecret, redirectUri } = authConfig;

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: authCode,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      const tokenData = await response.json();
      localStorage.setItem("access_token", tokenData.access_token);
      localStorage.setItem("refresh_token", tokenData.refresh_token);
      localStorage.setItem("id_token", tokenData.id_token);
      localStorage.setItem("code", authCode);
      await getUserInfo();
      navigate("/");
    } catch (error) {
      console.error("Token exchange failed:", error);
    }
  }, [navigate]);

  const getUserInfo = async () => {
    const token = localStorage.getItem("id_token");
    if (token) {
      try {
        const response = await fetch(authConfig.userInfoUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const userInfo = await response.json();
        localStorage.setItem("user", JSON.stringify(userInfo));
        console.log("User Info:", userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    if (authCode) {
      exchangeCodeForToken(authCode);
    }
  }, [exchangeCodeForToken]);

  const redirectToSSO = () => {
    const { authUrl, clientId, redirectUri } = authConfig;
    const redirect = encodeURIComponent(redirectUri);
    const scope = "openid";

    window.location.href = `${authUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirect}&scope=${scope}`;
  };

  const handleSignUp = () => {
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-10">
          Welcome to ASTRA, <br />
          Automated Strategic Treasury Risk Analyzer
        </h1>
        <div className="space-x-6">
          <button
            onClick={redirectToSSO}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Sign In
          </button>
          <button
            onClick={handleSignUp}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}