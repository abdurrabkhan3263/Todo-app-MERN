import useApp from "@/context/context";
import { Todo_Card } from "@/components";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import TodoApi from "@/Api/Todo";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Outlet } from "react-router-dom";

function Important() {
  const { mode } = useApp();
  const impHeading = React.useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["getImpTodo"],
    queryFn: async () => await TodoApi.getImportantTodo(),
  });

  useGSAP(() => {
    gsap.from(impHeading.current, {
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
          ref={impHeading}
        >
          Important Todo
        </div>
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-5 gap-6">
        {isLoading
          ? "Loading......"
          : Array.isArray(data) && data.length > 0
            ? data.map(
                ({ _id, todoName, content, isCompleted, isImportant }) => (
                  <div key={_id}>
                    <Todo_Card
                      title={todoName}
                      content={content}
                      isCompleted={isCompleted}
                      isImportant={isImportant}
                      id={_id}
                    />
                  </div>
                ),
              )
            : "No Important found"}
      </div>
    </div>
  );
}

export default Important;
