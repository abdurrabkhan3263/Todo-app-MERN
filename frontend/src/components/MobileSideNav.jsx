import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { List, ListTodo, Group, Star } from "../assets/icons";
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
  const { user: { user } = "" } = useApp();
  const navigate = useNavigate();

  console.log(user);
  return (
    <div>
      <div className="flex h-32 w-full items-center justify-between overflow-hidden px-5">
        <div className="h-16 w-16" onClick={() => navigate("/")}>
          <img
            src={todo__logo}
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
        <div className="rgb__Effect h-16 w-16 rounded-full text-white">
          sdfsfsf
        </div>
      </div>
      <div className="my-5 flex h-16 w-full items-center justify-between bg-gray-500 px-5 py-2 md:justify-normal md:gap-x-10 md:px-9">
        {navInfo.map(({ name, Icon, path }) => (
          <NavLink
            key={name}
            className={({ isActive }) =>
              `flex h-full w-[52px] items-center justify-center rounded-md ${isActive ? "bg-white" : "bg-blue-200"}`
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

//  <div className="img__Container relative h-16 w-16 cursor-pointer rounded-full">
//    <div className="rgb__Effect h-full w-full">
//      <div className="h-full w-full overflow-hidden rounded-full">
//        <img
//          src={todo__logo}
//          alt="user__profile"
//          className="h-full w-full object-cover"
//        />
//      </div>
//    </div>
//    <div className="user__Container absolute bottom-0 left-[56px] hidden h-[310px] w-[245px] rounded-xl p-2">
//      <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-xl">
//        <ProfileSection userName={"ABdurrab"} avatar={todo__logo} />
//      </div>
//    </div>
//  </div>;

{
  /* <div className="rgb__Effect h-16 w-16 rounded-full">
  {user?.avatar?.url && (
    <img src={user.avatar.url} alt={`${user.fullName}'s profile`} />
  )}
</div>; */
}
