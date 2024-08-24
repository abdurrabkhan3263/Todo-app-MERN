import React from "react";
import { AddCard, Todo_Card } from "@/components";
import useApp from "@/context/context";
import TodoApi from "@/Api/Todo";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Todo() {
  const { mode, logoutUser } = useApp();
  const todoHeading = React.useRef(null);
  const navigate = useNavigate();

  const {
    data = "",
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => await TodoApi.getDirectTodo(),
  });

  useGSAP(() => {
    gsap.from(todoHeading.current, {
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
          ref={todoHeading}
        >
          Todo
        </div>
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-5">
        <AddCard navLink={"/todo"} />
        {isLoading
          ? "Loading......"
          : Array.isArray(data) &&
            data.length > 0 &&
            data.map(({ _id, todoName, content, isCompleted, isImportant }) => (
              <div key={_id}>
                <Todo_Card
                  title={todoName}
                  content={content}
                  isCompleted={isCompleted}
                  isImportant={isImportant}
                  id={_id}
                  belongsTo={"todo"}
                />
              </div>
            ))}
      </div>
    </div>
  );
}

export default Todo;
