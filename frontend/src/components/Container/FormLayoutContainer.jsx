import useApp from "@/context/context";
import React from "react";

function FormLayoutContainer({ children }) {
  const { mode } = useApp();
  return (
    <div
      className={`flex h-screen w-screen flex-col items-center lg:h-[70vh] lg:w-[90vw] 2xl:w-[27vw] ${mode === "dark" ? "border-white" : "border-gray-700"} justify-between border bg-slate-300 p-5 shadow-lg md:rounded-xl`}
    >
      {children}
    </div>
  );
}

export default FormLayoutContainer;
