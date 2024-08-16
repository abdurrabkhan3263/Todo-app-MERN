import React from "react";
import { useParams } from "react-router-dom";
import TodoApi from "@/Api/Todo";
import { useQuery } from "@tanstack/react-query";
import useApp from "@/context/context";
import { AddCard, Todo_Card } from "@/components";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function List_Todo() {
  const { id } = useParams();
  const { mode } = useApp();
  const listTodoHeading = React.useRef(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["listTodos"],
    queryFn: async () => {
      if (!id) return { message: "Id is not found" };
      return await TodoApi.getListsTodo(id);
    },
  });

  if (isError) {
    toast.error(error);
  }

  useGSAP(() => {
    gsap.from(listTodoHeading.current, {
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
          className={`text-4xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
          ref={listTodoHeading}
        >
          {data?.listName || ""}
        </div>
      </div>
      <div className="mt-6 grid h-full w-full flex-1 grid-cols-5 gap-6">
        <AddCard navLink={"todo"} />
        {isLoading
          ? "Loading......"
          : Array.isArray(data?.todos) &&
            data?.todos.length > 0 &&
            data.todos.map(
              ({ _id, todoName, content, isCompleted, isImportant }) => (
                <div key={_id}>
                  <Todo_Card
                    title={todoName}
                    content={content}
                    isCompleted={isCompleted}
                    isImportant={isImportant}
                    id={_id}
                    belongsTo={"list"}
                  />
                </div>
              ),
            )}
      </div>
    </div>
  );
}

export default List_Todo;
