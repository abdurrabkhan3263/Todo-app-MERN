import React from "react";
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
import FormLayoutContainer from "./Container/FormLayoutContainer";

function AddTodo() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { mode } = useApp();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { id } = useParams();

  const handleTodoMutation = useMutation({
    mutationKey: ["crTodo"],
    mutationFn: async (data) => TodoApi.createTodo(data),
    onSuccess: async (result) => {
      toast.success(result.message);
      client.invalidateQueries({ queryKey: ["todos"] });
      navigate(-1);
    },
    onMessage: async (result) => toast.success(result.message),
  });
  const handleListTodoMutation = useMutation({
    mutationKey: ["listTodos"],
    mutationFn: async (data) => await TodoApi.createListTodo(id, data),
    onSuccess: (message) => {
      toast.success(message);
      client.invalidateQueries({ queryKey: ["listTodos"] });
      navigate(-1);
    },
    onError: (error) => toast.error(error),
  });

  const formSubmit = (data) => {
    if (!id) {
      handleTodoMutation.mutate(data);
    } else {
      handleListTodoMutation.mutate(data);
    }
  };

  const handleBackNav = () => {
    navigate(-1);
  };

  return (
    <FormLayoutContainer>
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
                min={new Date().toISOString().slice(0, 16)}
                className="rounded-md px-3 py-2 outline-none ring-darkCard focus:ring-1"
                {...register("remindMe", {
                  validate: (value) => {
                    if (!value) return true;
                    const selectedDate = new Date(value).getTime();
                    const now = Date.now();
                    const tenMinutesFromNow = now + 10 * 60 * 1000;
                    if (selectedDate <= tenMinutesFromNow) {
                      setValue("remindMe", formatDate(selectedDate));
                      toast.warning(
                        "Please select a time at least 10 minutes in the future",
                      );
                      return false;
                    }
                    return true;
                  },
                })}
              />
              {errors?.remindMe && <p>{errors.remindMe.message}</p>}
            </div>
          </div>
          <Button size={"lg"} type={"submit"}>
            Add
          </Button>
        </form>
      </div>
    </FormLayoutContainer>
  );
}

export default AddTodo;
