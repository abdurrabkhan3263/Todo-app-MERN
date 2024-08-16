import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TodoApi from "@/Api/Todo";
import { useNavigate, useParams } from "react-router-dom";
import useApp from "@/context/context";
import { formatDate } from "@/lib/utils";

function EditTodo() {
  const { register, handleSubmit, setValue } = useForm();
  const [todoData, setTodoData] = useState(null);
  const { mode } = useApp();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { todo_id } = useParams();

  const handleUpdateTodo = useMutation({
    mutationKey: ["UpTodo"],
    mutationFn: async (data) => await TodoApi.updateTodo(todo_id, data),
    onSuccess: (result) => {
      client.invalidateQueries({ queryKey: ["todos"] });
      toast.success(result.message);
      navigate(-1);
    },
    onError: (error) => toast.success(error),
  });

  const formSubmit = (data) => {
    const updatedData = {};
    if (data?.todoName !== todoData?.todoName)
      updatedData.todoName = data.todoName;

    if (data?.content !== todoData?.content) updatedData.content = data.content;

    if (data?.remindMe !== todoData?.remindMe)
      updatedData.remindMe = data.remindMe;

    if (Object.keys(updatedData).length <= 0) {
      return navigate(-1);
    }
    console.log(updatedData);
    return;
    handleUpdateTodo.mutate(data);
  };

  const handleBackNav = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (todo_id) {
      (async () => {
        try {
          let {
            todoName = "",
            content = "",
            remindMe = "",
            dueDate = "",
          } = await TodoApi.getTodoById(todo_id);
          const formattedDate = formatDate(remindMe);
          todoName && setValue("todoName", todoName);
          content && setValue("content", content);
          remindMe && setValue("remindMe", formattedDate);

          setTodoData({ todoName, content, remindMe: formattedDate });
        } catch (error) {
          typeof error === "string" && toast.error(error);
        }
      })();
    }
  }, [todo_id]);

  return (
    <div
      className={`flex h-[70vh] w-[27vw] flex-col items-center ${mode === "dark" ? "border-white" : "border-gray-700"} justify-between rounded-xl border bg-slate-300 p-5 shadow-lg`}
    >
      <div className="flex h-12 w-full items-center justify-between">
        <p className="text-3xl font-semibold text-gray-700">Todo</p>
        <button className="h-full" onClick={() => handleBackNav()}>
          <X width={"35px"} height={"35px"} />
        </button>
      </div>
      <div className="w-full flex-1 pt-3">
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex h-full flex-col justify-between"
        >
          <div className="flex flex-col gap-y-6">
            <div>
              <label htmlFor="todo_name" className="font-medium">
                Todo name
              </label>
              <Input
                id="todo_name"
                {...register("todoName")}
                className="mt-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="des" className="mb-2 font-medium">
                Todo description
              </label>
              <textarea
                id="des"
                className="h-[110px] resize-none rounded-md p-2 outline-none ring-darkCard focus:ring-1"
                {...register("content", { required: true })}
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label htmlFor="remind_me" className="mb-2 font-medium">
                Remind me
              </label>
              <input
                type="datetime-local"
                id="remind_me"
                className="rounded-md px-3 py-2 outline-none ring-darkCard focus:ring-1"
                {...register("remindMe", {
                  validate: (value) => {
                    const selectedDate = new Date(value).getTime();
                    const now = Date.now();
                    const tenMinutesFromNow = now + 10 * 60 * 1000;

                    if (
                      !value ||
                      selectedDate === new Date(todoData.remindMe).getTime()
                    )
                      return true;

                    if (selectedDate <= tenMinutesFromNow) {
                      setValue("remindMe", formatDate(todoData.remindMe));
                      toast.warning(
                        "Please select a time at least 10 minutes in the future",
                      );
                      return "Please select a time at least 10 minutes in the future";
                    }
                    return true;
                  },
                })}
              />
            </div>
          </div>
          <Button size={"lg"} type={"submit"}>
            Add
          </Button>
        </form>
      </div>
    </div>
  );
}

export default EditTodo;
