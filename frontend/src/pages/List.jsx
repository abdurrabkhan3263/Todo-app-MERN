import useApp from "@/context/context";
import React from "react";
import { Outlet } from "react-router-dom";
import { AddCard, List_Card } from "@/components";
import { useQuery } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";
import { toast } from "sonner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function List() {
  const { mode } = useApp();
  const listHeading = React.useRef(null);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => await TodoApi.getLists(),
  });

  if (isError) {
    toast.error(error);
  }

  useGSAP(() => {
    gsap.from(listHeading.current, {
      duration: 0.5,
      y: 100,
      ease: "power3.out",
    });
  }, []);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="fixed bottom-1/2 right-[42%] z-[70] translate-x-1/2 translate-y-1/2">
        <Outlet />
      </div>
      <div className="overflow-hidden">
        <div
          className={`text-6xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
          ref={listHeading}
        >
          List
        </div>
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-5 gap-6">
        <AddCard navLink={"add-list"} />
        {isLoading
          ? "Loading......"
          : Array.isArray(data) &&
            data.length > 0 &&
            data.map(({ _id, listName, description, theme }) => (
              <div key={_id}>
                <List_Card
                  title={listName}
                  content={description || ""}
                  color={theme}
                  id={_id}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

export default List;
