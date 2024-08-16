import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { no__image__available } from "@/assets/icons";
import { Input } from "./ui/input";
import useApp from "@/context/context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import User from "@/Api/User";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function UpdateProfile() {
  const { mode } = useApp();
  const { data: { data: { fullName, username, avatar } = {} } = {} } = useQuery(
    {
      queryKey: ["userDetails"],
      queryFn: async () => await User.getCurrentUser(),
    },
  );
  const [imageUrl, setImageUrl] = useState("");
  const [input, setInput] = useState({
    fullName: "",
    username: "",
    avatar: "",
  });
  const client = useQueryClient();
  const navigate = useNavigate();
  const updateTxtRef = React.useRef(null);
  const loadingRef = React.useRef(null);

  // Function to handle the profile image
  const handleInputChange = (e) => {
    const name = e.target.name;
    if (name === "avatar") {
      const file = e.target.files[0];
      if (file) {
        setInput((prev) => ({ ...prev, [name]: file }));
        setImageUrl(URL.createObjectURL(e.target.files[0]));
      } else {
        setInput((prev) => ({ ...prev, [name]: "" }));
        setImageUrl("");
      }
    } else {
      const value = e.target.value;
      setInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const profileMutation = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (formData) => {
      return await User.updateProfile(formData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      client.invalidateQueries("userDetails");
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error);
      navigate(-1);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (fullName !== input.fullName)
      formData.append("fullName", input.fullName);
    if (username !== input.username)
      formData.append("username", input.username);
    if (input.avatar) formData.append("avatar", input.avatar);

    if (Array.from(formData.keys()).length > 0 && !profileMutation.isPending) {
      profileMutation.mutate(formData);
    } else {
      !profileMutation.isPending && navigate(-1);
    }
  };

  useGSAP(() => {
    if (profileMutation.isPending) {
      const timeLine = gsap.timeline();
      timeLine.to(updateTxtRef.current, {
        opacity: 0,
        y: -115,
        duration: 0.2,
      });
      timeLine.to(loadingRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
      });
    }
  }, [profileMutation.isPending]);

  React.useEffect(() => {
    if (fullName && username && avatar) {
      setInput({ fullName, username });
      setImageUrl(avatar.url);
    }
  }, [fullName, username, avatar]);

  return (
    <div className={`h-[50vh] w-[23vw] rounded-xl bg-white p-4`}>
      <form
        className="flex h-full w-full flex-col items-center justify-between"
        onSubmit={handleFormSubmit}
      >
        <div className="w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-xl font-semibold">Update Profile</p>
            <button
              onClick={() => navigate(-1)}
              className="rounded-full p-1 text-stone-800 transition-colors hover:bg-gray-300"
            >
              <X width={"35px"} height={"35px"} />
            </button>
          </div>
          <div className="flex w-full flex-col gap-y-5">
            <div className="flex w-full items-center justify-between pt-4">
              <div className="h-28 w-28 overflow-hidden rounded-full border border-black bg-blue-500">
                <img
                  src={imageUrl ? imageUrl : no__image__available}
                  alt="user"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative h-fit w-32 cursor-pointer overflow-hidden rounded-md bg-lightHead py-1">
                <p className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-pointer text-center font-semibold text-white">
                  Upload
                </p>
                <input
                  type="file"
                  accept="image/jpg , image/png , image/jpeg"
                  className="opacity-0"
                  onInput={handleInputChange}
                  name="avatar"
                />
              </div>
            </div>
            <div>
              <label htmlFor="full_Name" className="font-medium">
                Full Name
              </label>
              <Input
                name="fullName"
                id="full_Name"
                className="mt-2 focus:ring-blue-500"
                placeholder="Enter fullName"
                onChange={handleInputChange}
                value={input.fullName}
              />
            </div>
            <div>
              <label htmlFor="username" className="font-medium">
                Username
              </label>
              <Input
                name="username"
                id="username"
                className="mt-2 focus:ring-blue-500"
                placeholder="Enter username"
                onChange={handleInputChange}
                value={input.username}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button type="submit" size="full" className="relative">
            <div className="relative h-3 w-full overflow-hidden">
              <p
                ref={updateTxtRef}
                className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 font-semibold"
              >
                Update
              </p>
              <span
                ref={loadingRef}
                className="opacity-1 absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 scale-0 font-semibold"
              >
                Loading....
              </span>
            </div>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProfile;
