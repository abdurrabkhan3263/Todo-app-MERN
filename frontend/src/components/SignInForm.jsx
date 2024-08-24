import React from "react";
import { Link } from "react-router-dom";
import FormLayout from "./FormLayout";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AtSignIcon,
  KeyRoundIcon,
  OpenEye,
  CloseEye,
  Camera,
  Name,
  Phone,
  Person,
} from "@/assets/icons";
import { Auth } from "@/pages";

function SignInForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [imgUrl, setImgUrl] = React.useState("");
  const { register, setValue, handleSubmit } = useForm();
  const handleForm = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (data) => {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "avatar" && data[key][0] instanceof File) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      setValue("avatar", "");
      setValue("fullName", "");
      setValue("username", "");
      setValue("email", "");
      setValue("password", "");
      setValue("phoneNumber", "");
      setImgUrl("");
      toast.success("User has been created successfully");
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message);
    },
  });

  const formSubmit = (data) => {
    const { fullName, email, password, username, phoneNumber } = data;
    if (!(data?.avatar[0] instanceof File))
      return toast.warning("Avatar image is requied");

    if (
      ![fullName, email, password, username, phoneNumber].every((items) =>
        items.trim(),
      )
    )
      return toast.warning(
        "fullName, email, phone number, password and username is required",
      );
    handleForm.mutate(data);
  };
  return (
    <Auth>
      <FormLayout headingContent={"Create an Account"}>
        <form
          className="flex h-full w-full flex-col justify-between overflow-hidden"
          onSubmit={handleSubmit(formSubmit)}
        >
          <div className="mt-3 flex h-[410px] flex-col gap-y-4 overflow-y-auto">
            {/* User Avatar Image Section */}
            <div>
              <div className="relative mt-2 h-[9rem] w-[9rem] overflow-hidden rounded-full bg-gray-500">
                {imgUrl && (
                  <img
                    src={URL.createObjectURL(imgUrl)}
                    alt="avatar__image"
                    className="h-full w-full object-cover"
                  />
                )}
                <input
                  type="file"
                  className="absolute right-1/2 top-1/2 z-10 h-[28px] w-[28px] -translate-y-1/2 translate-x-1/2 opacity-0"
                  {...register("avatar", {
                    onChange: (e) => setImgUrl(e.target.files[0]),
                  })}
                />
                <span className="absolute right-1/2 top-1/2 z-0 -translate-y-1/2 translate-x-1/2 text-white">
                  <Camera height={28} width={28} />
                </span>
              </div>
            </div>
            {/* User name section */}
            <div>
              <label htmlFor="fullName" className="font-semibold">
                Enter full name
              </label>
              <div className="relative mt-2">
                <Input
                  type="text"
                  id="fullName"
                  {...register("fullName")}
                  className="peer border-none py-[22px] pl-10 text-base text-gray-900 ring-gray-500 focus:ring"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
                  <Name height={20} width={20} />
                </span>
              </div>
            </div>
            {/* User username section */}
            <div>
              <label htmlFor="username" className="font-semibold">
                Enter username
              </label>
              <div className="relative mt-2">
                <Input
                  type="text"
                  id="username"
                  {...register("username")}
                  className="peer border-none py-[22px] pl-10 text-base text-gray-900 ring-gray-500 focus:ring"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
                  <Person height={20} width={20} />
                </span>
              </div>
            </div>
            {/* User email section */}
            <div>
              <label htmlFor="email" className="font-semibold">
                Enter email
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
            {/* User PhoneNumber section */}
            <div>
              <label htmlFor="phoneNumber" className="font-semibold">
                Enter phone number
              </label>
              <div className="relative mt-2">
                <Input
                  type="text"
                  id="phoneNumber"
                  {...register("phoneNumber", { pattern: /^\d{10}$/ })}
                  className="peer border-none py-[22px] pl-10 text-base text-gray-900 ring-gray-500 focus:ring"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
                  <Phone height={20} width={20} />
                </span>
              </div>
            </div>
            {/* Password section */}
            <div>
              <label htmlFor="password" className="font-semibold">
                Enter password
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
          <div className="mt-2">
            <div className="text-end">
              <Button
                type="submit"
                className="w-full bg-white text-base font-bold text-gray-800 hover:bg-gray-200"
              >
                SignUp
              </Button>
            </div>
            <p className="mt-3 text-center">
              Already have not account?
              <span className="pl-2.5 underline-offset-1 hover:underline">
                <Link to={"/login"}>Log-in</Link>
              </span>
            </p>
          </div>
        </form>
      </FormLayout>
    </Auth>
  );
}

export default SignInForm;
