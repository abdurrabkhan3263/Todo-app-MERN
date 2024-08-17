import useApp from "../context/context";
import React from "react";
import { background_image } from "@/assets/icons";

function Auth({ children }) {
  const { mode } = useApp();

  return (
    <div
      className={`flex h-screen w-screen items-center justify-center bg-cover`}
      style={{
        backgroundImage: `url(${background_image})`,
      }}
    >
      {children}
    </div>
  );
}

export default Auth;
