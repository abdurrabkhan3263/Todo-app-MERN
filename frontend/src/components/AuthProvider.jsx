import useApp from "@/context/context";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import UserApi from "@/Api/User";

export default function AuthProvider({ children, authentication = true }) {
  const { logoutUser } = useApp();
  const [loader, setLoader] = React.useState(true);
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const location = useLocation();

  let decodedAccessToken;
  let decodedRefreshToken;
  const now = Date.now() / 1000;

  async function checkingToken() {
    try {
      decodedAccessToken = jwtDecode(accessToken);
      decodedRefreshToken = jwtDecode(refreshToken);

      if (decodedAccessToken.exp < now && decodedRefreshToken.exp > now) {
        try {
          await UserApi.refreshAccessToken();
        } catch (error) {
          logoutUser();
          navigate("/login");
          return;
        }
      } else if (decodedRefreshToken.exp < now) {
        logoutUser();
        navigate("/login");
        return;
      }
    } catch (error) {
      logoutUser();
      navigate("/login");
    }
  }

  React.useEffect(() => {
    const pathname = location.pathname;
    if (!accessToken || !refreshToken) {
      navigate("/login");
      setLoader(false);
      return;
    }
    if (authentication) {
      checkingToken();
    } else if (
      jwtDecode(accessToken).exp > now &&
      jwtDecode(refreshToken).exp > now &&
      (pathname.startsWith("/login") || pathname.startsWith("/sign-in"))
    ) {
      navigate("/");
    }
    console.log("hell");
    setLoader(false);
  }, [navigate, authentication, accessToken, refreshToken, location.pathname]);

  if (loader) {
    return <div className="bg-white">Loading.....</div>;
  }

  return <>{children}</>;
}
