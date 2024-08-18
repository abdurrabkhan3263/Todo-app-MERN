import React from "react";

function Container({ children }) {
  return (
    <div className="w-full px-5 pb-4 xl:px-0 xl:pl-[370px]">{children}</div>
  );
}

export default Container;
