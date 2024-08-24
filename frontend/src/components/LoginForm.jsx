/* eslint-disable no-useless-catch */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import FormLayout from "./FormLayout";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { base_url } from "@/conf";
import { toast } from "sonner";
import useApp from "@/context/context";
import { AtSignIcon, KeyRoundIcon, OpenEye, CloseEye } from "@/assets/icons";
import { Auth } from "@/pages";

function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { loginUser } = useApp();

  const formSubmitMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      try {
        const response = await fetch(`${base_url}/user/login`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });
        let result = await response.json();
        if (!response.ok) {
          throw result.message;
        }
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async ({ data }) => {
      navigate("/");
      loginUser(data);
      toast.success("User login successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const formSubmit = (data) => {
    if (!data?.email || !data?.password)
      return toast.warning("Email and password is required");
    formSubmitMutation.mutate(data);
  };
  return (
    <Auth>
      <FormLayout headingContent={"Login your account"}>
        <form
          onSubmit={handleSubmit(formSubmit)}
          className="flex h-full flex-col justify-between"
        >
          <div className="flex flex-col gap-y-8">
            <div>
              <label htmlFor="email" className="font-semibold">
                Enter your email
              </label>
              <div className="relative mt-2">
                <Input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="peer border-none py-[22px] pl-10 text-base text-gray-900 ring-gray-500 focus:ring"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
                  <AtSignIcon height={20} width={20} />
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="password" className="font-semibold">
                Enter your password
              </label>
              <div className="relative mt-2">
                <Input
                  type={!showPassword ? "password" : "text"}
                  id="password"
                  {...register("password")}
                  className="peer border-none px-10 py-[22px] text-base text-gray-900 ring-gray-500 focus:ring"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
                  <KeyRoundIcon height={20} width={20} />
                </span>
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {!showPassword ? (
                    <OpenEye height={20} width={20} />
                  ) : (
                    <CloseEye height={20} width={20} />
                  )}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-end">
              <Button
                type="submit"
                className="w-full bg-white text-base font-bold text-gray-800 hover:bg-gray-200"
              >
                Login
              </Button>
            </div>
            <p className="mt-3 text-center">
              Already have not account?
              <span className="pl-2.5 underline-offset-1 hover:underline">
                <Link to={"/sign-in"}>Sign-in</Link>
              </span>
            </p>
          </div>
        </form>
      </FormLayout>
    </Auth>
  );
}

export default LoginForm;
