import useApp from "@/context/context";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthProvider({ children, authentication = true }) {
  const [loader, setLoader] = React.useState(true);
  const {
    user: { status },
  } = useApp();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (status && authentication !== authentication) {
      navigate("/login");
    } else if (!authentication && status !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [status, navigate, authentication]);
  return <>{loader ? <div>Loading.....</div> : children}</>;
}
