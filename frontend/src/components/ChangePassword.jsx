import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserApi from "@/Api/User";

function ChangePassword() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (
      formData.get("oldPassword") === "" ||
      formData.get("newPassword") === ""
    ) {
      toast.warning("Please fill all fields");
      return;
    }
    try {
      await UserApi.changePassword(formData);
      toast.success("Password changed successfully");
      navigate(-1);
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div
      className={`h-fit w-[90vw] rounded-xl bg-white p-4 sm:w-[50vw] xl:w-[23vw]`}
    >
      <div className="flex w-full items-center justify-between">
        <p className="text-xl font-semibold text-gray-700">Change Password</p>
        <button className="text-gray-700" onClick={() => navigate(-1)}>
          <X width={"35px"} height={"35px"} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mt-3 w-full">
          <div className="w-full">
            <label htmlFor="old-password">Old Password</label>
            <Input
              name="oldPassword"
              className="my-2"
              placeholder="Enter old Password"
            />
          </div>
          <div className="w-full">
            <label htmlFor="new-password">New Password</label>
            <Input
              name="newPassword"
              className="my-2"
              placeholder="Enter new Password"
            />
          </div>
        </div>
        <div className="mt-4 h-fit w-full">
          <Button size="full" className="font-semibold" type="submit">
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
