import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authConfig } from "../utils/authConfig";
import { BarChart3, TrendingUp, Globe2 } from "lucide-react";

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
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="w-full flex flex-col md:flex-row items-center">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-14 ml-5 text-blue-900">Transform Your Financial Analytics</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <BarChart3 className="w-6 h-6 mt-1 text-blue-600" />
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Real-time Analytics</h3>
                <p className="text-gray-600">Monitor exchange rates and interest rates with advanced forecasting capabilities</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 mt-1 text-blue-600" />
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Strategic Insights</h3>
                <p className="text-gray-600">Make informed decisions with predictive analytics and trend analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Globe2 className="w-6 h-6 mt-1 text-blue-600" />
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Global Coverage</h3>
                <p className="text-gray-600">Comprehensive monitoring of international markets and rates</p>
              </div>
            </div>
          </div>
        </div>

        <div className=" max-w-md p-8 rounded-xl shadow-lg border border-gray-200">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-blue-900">ASTRA</h1>
            <p className="text-gray-600 mb-8 font-semibold">Automated Strategic Treasury Risk Analyzer</p>
            
            <div className="space-y-4">
              <button
                onClick={redirectToSSO}
                className="w-full px-6 py-4 mb-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                className="w-full px-6 py-4 mb-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}