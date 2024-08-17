import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SideNav } from "./components";
import Container from "./components/Container/Container";
import { AppProvider } from "./context/context";
import UserApi from "./Api/User";

function App() {
  const [user, setUser] = useState({ status: false, user: null });
  const [mode, setMode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const response = await UserApi.getCurrentUser();
        loginUser(response?.data);
      } catch (error) {
        setIsError(true);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [navigate]);

  const changeMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };
  const logoutUser = () => {
    setUser({ status: false, user: null });
  };
  const loginUser = (userData) => {
    setUser({ status: true, user: userData });
  };
  const getUserDetails = () => {
    if (user) {
      return user?.user;
    }
  };

  useEffect(() => {
    if (mode.trim()) {
      localStorage.setItem("mode", JSON.stringify(mode));
    }
  }, [mode]);

  useEffect(() => {
    const mode = JSON.parse(localStorage.getItem("mode"));
    setMode(mode || "light");
  }, []);

  return (
    <AppProvider
      value={{ mode, user, changeMode, loginUser, logoutUser, getUserDetails }}
    >
      <div
        className={`min-h-screen ${mode === "light" ? "bg-white" : "bg-dark"}`}
      >
        {isLoading ? (
          <div
            className={`flex h-screen w-screen items-center justify-center ${mode === "light"}`}
          >
            loading.....
          </div>
        ) : !user?.status ? (
          <Outlet />
        ) : (
          <div className={`flex w-full p-4`}>
            <SideNav />
            <Container>
              <Outlet />
            </Container>
          </div>
        )}
      </div>
    </AppProvider>
  );
}

export default App;
