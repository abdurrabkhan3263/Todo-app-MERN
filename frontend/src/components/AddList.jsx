import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import TodoApi from "@/Api/Todo";
import { useNavigate } from "react-router-dom";
import useApp from "@/context/context";
import { useParams } from "react-router-dom";
import { darkColor, lightColor } from "@/lib/colors";
import FormLayoutContainer from "./Container/FormLayoutContainer";

function AddList() {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const [uiColor, setUiColor] = useState({});
  const [transValue, setTransValue] = useState(200);

  const { list_id } = useParams();
  const { mode } = useApp();
  const navigate = useNavigate();
  const client = useQueryClient();

  const { data } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      if (list_id) {
        return await TodoApi.getListsTodo(list_id);
      }
      return "";
    },
  });

  const handleFormMutation = useMutation({
    mutationKey: ["addList"],
    mutationFn: async (data) => TodoApi.createList(data),
    onSuccess: async (result) => {
      toast.success(result.message);
      client.invalidateQueries({ queryKey: ["lists"] });
      navigate("/list");
    },
    onMessage: async (result) => toast.success(result.message),
  });

  const updateMutation = useMutation({
    mutationKey: ["upList"],
    mutationFn: async (data) => {
      return await TodoApi.updateList(list_id, data);
    },
    onSuccess: (result) => {
      toast.success(result.message);
      client.invalidateQueries({ queryKey: ["lists"] });
      client.invalidateQueries({ queryKey: ["allGroupList"] });
      navigate(-1);
    },
    onError: (message) => toast.error(message),
  });

  const formSubmit = (formData) => {
    if (!list_id) {
      handleFormMutation.mutate(formData);
    } else {
      const {
        listName: fromDataListName = "",
        description: fromDataDescription = "",
        theme: { lightColor = "", darkColor = "" },
      } = formData;
      const {
        listName = "",
        description = "",
        theme: { lightColor: lColor = "", darkColor: dColor = "" },
      } = data;

      if (
        listName !== fromDataListName ||
        description !== fromDataDescription ||
        lightColor !== lColor ||
        darkColor !== dColor
      ) {
        updateMutation.mutate(formData);
      } else {
        navigate("/list");
      }
    }
  };

  const setColor = useCallback(
    (colorObj) => {
      setValue("theme", { ...getValues("theme"), ...colorObj });
    },
    [getValues("theme")],
  );

  useEffect(() => {
    if (list_id && data) {
      const { description = "", listName = "", theme = "" } = data;
      setValue("listName", listName);
      setValue("description", description);
      setValue("theme", theme);
      setUiColor(theme);
    }
  }, [data]);

  useEffect(() => {
    console.log(transValue);
  }, [transValue]);

  return (
    <FormLayoutContainer>
      <div className="flex h-12 w-full items-center justify-between">
        <p className="text-3xl font-semibold text-gray-700">List</p>
        <button className="h-full" onClick={() => navigate(-1)}>
          <X width={"35px"} height={"35px"} />
        </button>
      </div>
      <div className="w-full flex-1 pt-3">
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex h-full w-full flex-col justify-between"
        >
          <div className="flex w-full flex-col gap-y-6">
            <div>
              <label htmlFor="list_name" className="font-medium">
                List name
              </label>
              <Input
                id="list_name"
                {...register("listName", { required: true })}
                className="mt-2 font-medium"
                placeholder="Enter list name"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="des" className="font-medium">
                List description
              </label>
              <textarea
                id="des"
                className="mt-2 h-[110px] resize-none rounded-md p-2 outline-none ring-darkCard focus:ring-1"
                {...register("description")}
              ></textarea>
            </div>
            <div className="w-full">
              <label htmlFor="light_mode_color" className="font-medium">
                Choose light mode color
              </label>
              <div className="relative mt-2 w-full overflow-hidden">
                <span
                  className="absolute left-0 top-1/2 z-50 h-full -translate-y-1/2 cursor-pointer content-center"
                  onClick={() =>
                    setTransValue((prev) => (prev >= 200 ? prev : prev + 56))
                  }
                >
                  <ChevronLeft />
                </span>
                <div className="h-14">
                  <div
                    className={`absolute top-1/2 flex w-full -translate-y-1/2 items-center justify-center gap-2 transition-all`}
                    style={{ left: `${transValue}px` }}
                  >
                    {lightColor.map((color) => {
                      return (
                        <div
                          key={color}
                          value={color}
                          className={`h-[40px] w-[40px] flex-shrink-0 cursor-pointer rounded-full ${uiColor?.lightColor === color && "border-2"} border-white`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setUiColor((prev) => ({
                              ...prev,
                              lightColor: color,
                            }));
                            setColor({ lightColor: color });
                          }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
                <span
                  className="absolute right-0 top-1/2 h-full -translate-y-1/2 cursor-pointer content-center"
                  onClick={() =>
                    setTransValue((prev) => (prev <= -228 ? prev : prev - 56))
                  }
                >
                  <ChevronRight />
                </span>
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="light_mode_color" className="font-medium">
                Choose dark mode color
              </label>
              <div className="mt-2 flex w-full gap-x-4 overflow-x-auto">
                {darkColor.map((color) => {
                  return (
                    <div
                      key={color}
                      value={color}
                      className={`h-[40px] w-[40px] flex-shrink-0 cursor-pointer rounded-full ${uiColor?.darkColor === color && "border-2"} border-white`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setUiColor((prev) => ({ ...prev, darkColor: color }));
                        setColor({ darkColor: color });
                      }}
                    ></div>
                  );
                })}
              </div>
            </div>
          </div>
          <Button size={"lg"} type={"submit"}>
            {list_id ? "Update" : "Add"}
          </Button>
        </form>
      </div>
    </FormLayoutContainer>
  );
}

export default AddList;
