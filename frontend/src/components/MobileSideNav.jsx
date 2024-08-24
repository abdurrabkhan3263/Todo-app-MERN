import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  List,
  ListTodo,
  Group,
  Star,
  no__image__available,
} from "../assets/icons";
import { todo__logo } from "../assets/icons";
import useApp from "@/context/context";
import "./ui/style.css";
import { ProfileSection } from ".";

const navInfo = [
  {
    name: "Todo",
    Icon: ListTodo,
    path: "/",
  },
  {
    name: "List",
    Icon: List,
    path: "/list",
  },
  {
    name: "Group",
    Icon: Group,
    path: "/group",
  },
  {
    name: "Important",
    Icon: Star,
    path: "/important",
  },
];

function MobileSideNav() {
  const [showInfo, setShowInfo] = React.useState(false);
  const { user: { user } = "", mode } = useApp();
  const navigate = useNavigate();

  return (
    <div>
      <div className="relative flex h-32 w-full items-center justify-between bg-gray-400 px-5">
        <div
          className="h-16 w-16 rounded-full shadow-xl"
          onClick={() => navigate("/")}
        >
          <img
            src={todo__logo}
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
        <div
          className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-500 shadow-xl"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          <img
            src={user.avatar?.url || no__image__available}
            alt={`${user?.fullName || ""}'s profile image`}
            className="absolute h-full w-full object-cover"
          />
        </div>
        <div
          className={`absolute right-20 transition-all ${!showInfo ? "scale-0" : "scale-1"} top-1/2 z-50 block h-[310px] w-[245px] rounded-xl p-2`}
        >
          <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-xl">
            <ProfileSection
              userName={user?.fullName || ""}
              avatar={user.avatar?.url || no__image__available}
            />
          </div>
        </div>
      </div>
      <div className="mb-5 flex h-20 w-full items-center justify-between border-y px-5 py-4 md:justify-normal md:gap-x-10 md:px-9">
        {navInfo.map(({ name, Icon, path }) => (
          <NavLink
            key={name}
            className={({ isActive }) =>
              `flex h-full w-[52px] items-center justify-center rounded-md ${!isActive ? (mode === "light" ? "bg-white text-dark" : "bg-darkBtn text-white") : mode === "light" ? "bg-darkBtn text-white" : "bg-white text-dark"} ${mode === "dark" ? "shadow-[#ffffff40]" : "shadow-[#00000012]"}`
            }
            to={path}
          >
            {<Icon />}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default MobileSideNav;
