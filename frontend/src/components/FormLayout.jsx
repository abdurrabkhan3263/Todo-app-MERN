import React from "react";

function FormLayout({ children, headingContent }) {
  return (
    <div className="flex h-[67%] w-[27%] flex-col rounded-2xl border border-light bg-opacity-20 p-5 font-medium text-gray-200 shadow-2xl shadow-light backdrop-blur-md backdrop-filter">
      <div className="h-20">
        <p className="select-none text-4xl font-bold">{headingContent}</p>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default FormLayout;
