import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const [scrollPosition, setScrollPosition] = useState({
    lightColor: 0,
    darkColor: 0,
  });
  const lightContainerRef = useRef(null);
  const lightColorRef = useRef(null);
  const darkContainerRef = useRef(null);
  const darkColorRef = useRef(null);

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
    const handleResize = () => {
      setScrollPosition({ darkColor: 0, lightColor: 0 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scroll = (direction, name) => {
    const container =
      name === "lightColor"
        ? lightContainerRef.current
        : darkContainerRef.current;
    const colorContainer =
      name === "lightColor" ? lightColorRef.current : darkColorRef.current;

    if (!container || !colorContainer) return;

    const containerWidth = container.clientWidth;
    const scrollWidth = colorContainer.scrollWidth;
    const scrollAmount = containerWidth * 0.8;

    if (direction === "left") {
      setScrollPosition((prev) => ({
        ...prev,
        [name]: Math.min(scrollPosition[name] + scrollAmount, 0),
      }));
    } else {
      const maxScroll = containerWidth - scrollWidth;
      setScrollPosition((prev) => ({
        ...prev,
        [name]: Math.max(scrollPosition[name] - scrollAmount, maxScroll),
      }));
    }
  };

  useEffect(() => {
    if (list_id && data) {
      const { description = "", listName = "", theme = "" } = data;
      setValue("listName", listName);
      setValue("description", description);
      setValue("theme", theme);
      setUiColor(theme);
    }
  }, [data]);

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
              <div
                className="relative w-full overflow-hidden"
                ref={lightContainerRef}
              >
                {scrollPosition.lightColor < 0 && (
                  <button
                    className="absolute left-0 top-1/2 z-10 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center bg-gray-300 text-gray-800"
                    type="button"
                    onClick={() => scroll("left", "lightColor")}
                  >
                    <ChevronLeft />
                  </button>
                )}
                <div className="py-2">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    ref={lightColorRef}
                    style={{
                      transform: `translateX(${scrollPosition.lightColor}px)`,
                    }}
                  >
                    {lightColor.map((color) => (
                      <div
                        key={color}
                        className={`m-1 h-10 w-10 flex-shrink-0 cursor-pointer rounded-full ${
                          uiColor?.lightColor === color
                            ? "ring-2 ring-white"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setUiColor((prev) => ({
                            ...prev,
                            lightColor: color,
                          }));
                          setColor({ lightColor: color });
                        }}
                      />
                    ))}
                  </div>
                </div>
                {scrollPosition.lightColor >
                  lightContainerRef.current?.clientWidth -
                    lightColorRef.current?.scrollWidth && (
                  <button
                    type="button"
                    className="w- absolute right-0 top-1/2 z-10 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center bg-gray-300 text-gray-800"
                    onClick={() => scroll("right", "lightColor")}
                  >
                    <ChevronRight />
                  </button>
                )}
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="light_mode_color" className="font-medium">
                Choose dark mode color
              </label>
              <div
                className="relative w-full overflow-hidden"
                ref={darkContainerRef}
              >
                {scrollPosition.darkColor < 0 && (
                  <button
                    type="button"
                    className="absolute left-0 top-1/2 z-10 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center bg-gray-300 text-gray-800"
                    onClick={() => scroll("left", "darkColor")}
                  >
                    <ChevronLeft />
                  </button>
                )}
                <div className="py-2">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    ref={darkColorRef}
                    style={{
                      transform: `translateX(${scrollPosition.darkColor}px)`,
                    }}
                  >
                    {darkColor.map((color) => (
                      <div
                        key={color}
                        className={`m-1 h-10 w-10 flex-shrink-0 cursor-pointer rounded-full ${
                          uiColor?.darkColor === color
                            ? "ring-2 ring-white"
                            : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setUiColor((prev) => ({
                            ...prev,
                            darkColor: color,
                          }));
                          setColor({ darkColor: color });
                        }}
                      />
                    ))}
                  </div>
                </div>
                {scrollPosition.darkColor >
                  darkColorRef.current?.clientWidth -
                    darkColorRef.current?.scrollWidth && (
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 z-10 flex h-[48px] w-[48px] -translate-y-1/2 items-center justify-center bg-gray-300 text-gray-800"
                    onClick={() => scroll("right", "darkColor")}
                  >
                    <ChevronRight />
                  </button>
                )}
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
