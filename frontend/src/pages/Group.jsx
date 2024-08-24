import React from "react";
import { AddCard, Group_Card } from "@/components";
import { Outlet, useNavigate } from "react-router-dom";
import useApp from "@/context/context";
import { useQuery } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Group() {
  const { mode, logoutUser } = useApp();
  const groupHeading = React.useRef(null);
  const navigate = useNavigate();

  const {
    data: { data } = "",
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["group"],
    queryFn: async () => TodoApi.getGroup(),
  });

  useGSAP(() => {
    gsap.from(groupHeading.current, {
      duration: 0.5,
      y: 100,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="fixed bottom-1/2 right-[50%] z-[70] translate-x-1/2 translate-y-1/2">
        <Outlet />
      </div>
      <div className="overflow-hidden">
        <div
          className={`text-6xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
          ref={groupHeading}
        >
          Group
        </div>
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5">
        {isLoading ? (
          "Loading......"
        ) : (
          <>
            <AddCard navLink={"add-group"} />
            {Array.isArray(data) &&
              data.length > 0 &&
              data.map(({ _id, name }) => (
                <div key={_id} className="relative">
                  <Group_Card id={_id} groupName={name} />
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Group;
