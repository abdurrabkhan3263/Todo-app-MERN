import React from "react";
import "@/components/ui/style.css";
import { KeyRoundIcon, LogOut, Update } from "@/assets/icons";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useApp from "@/context/context";
import UserApi from "@/Api/User";

function ProfileSection({ userName, avatar }) {
  const { logoutUser, mode } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await UserApi.logoutUser();
      toast.success(response?.message);
      logoutUser();
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      logoutUser();
      navigate("/login");
    }
  };

  return (
    <>
      <div
        className={`hidden min-h-full flex-col items-center text-white xl:flex ${mode === "light" ? "bg-darkBtn" : "bg-lightNav"}`}
      >
        <div
          className={`flex h-[70px] w-full cursor-default items-center justify-between rounded-xl bg-orange-600 px-2 py-1 shadow-lg`}
        >
          <div className="hello h-full w-[62px] overflow-hidden rounded-full bg-blue-500">
            <img
              src={avatar || ""}
              alt="image"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 text-end">
            <p className="font-semibold">{userName || ""}</p>
          </div>
        </div>
        <div className="flex w-full flex-1 cursor-default flex-col items-center justify-center gap-y-4 px-2">
          <button
            className="flex h-11 w-full items-center gap-x-3 rounded-md bg-blue-500 px-3 transition-colors hover:bg-blue-600"
            onClick={() => navigate("update-profile")}
          >
            <Update /> <p className="text-sm font-semibold">Update Profile</p>
          </button>
          <button
            className="flex h-11 w-full items-center gap-x-3 rounded-md bg-blue-500 px-3 transition-colors hover:bg-blue-600"
            onClick={() => navigate("/change-password")}
          >
            <KeyRoundIcon />
            <p className="text-sm font-semibold">Change Password</p>
          </button>
        </div>
        <div className="flex h-[50px] w-full cursor-default items-center justify-between rounded-xl bg-orange-600 px-2 py-3 shadow-lg">
          <p className="text-base font-semibold">LogOut</p>
          <button
            onClick={handleLogout}
            className="rounded-full bg-transparent p-2.5 transition-colors hover:bg-gray-500"
          >
            <LogOut />
          </button>
        </div>
      </div>
      {/* Form Mobile Only */}
    </>
  );
}

export default ProfileSection;
