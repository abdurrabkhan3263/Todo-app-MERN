import {
  List,
  ListTodo,
  Group,
  Star,
  Moon,
  Sun,
  LogOut,
} from "../assets/icons";
import useApp from "@/context/context";
import { Button } from "./ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserApi from "@/Api/User";
import "@/components/ui/style.css";
import { ProfileSection } from "./index";
import { Switch } from "./ui/switch";

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

function SideNav() {
  const { mode, changeMode, logoutUser, getUserDetails } = useApp();
  const navigate = useNavigate();
  const {
    username = "",
    _id = "",
    avatar: { url } = "",
    fullName = "",
  } = getUserDetails();

  return (
    <div
      className={`fixed top-1/2 w-[320px] -translate-y-1/2 overflow-hidden rounded-2xl px-4 shadow-xl shadow-[#00000030] ${mode === "light" ? "bg-lightNav" : "border border-white bg-dark text-white"} `}
      style={{ height: "calc(100% - 2rem)" }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex flex-1 flex-col pt-6">
          <h3 className="text-2xl font-semibold">Menu</h3>
          <div className="pt-14">
            <p className="text-xl font-normal">Tasks</p>
            <div className="flex flex-col gap-y-6 pt-6">
              {navInfo.map(({ name, Icon, path }) => (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `flex w-full justify-start gap-x-6 rounded-md px-4 shadow-md ${!isActive ? (mode === "light" ? "bg-white text-dark" : "bg-darkBtn text-white") : mode === "light" ? "bg-darkBtn text-white" : "bg-white text-dark"} ${mode === "dark" ? "shadow-[#ffffff40]" : "shadow-[#00000012]"} py-3.5 font-medium`
                  }
                >
                  {<Icon />}
                  {name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-3 flex h-14 w-full">
          <div className="relative flex flex-1 items-center gap-4">
            <div className="img__Container relative h-full w-14 cursor-pointer rounded-full">
              <div className="rgb__Effect h-full w-full">
                <div className="h-full w-full overflow-hidden rounded-full">
                  <img
                    src={url || ""}
                    alt="user__profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="user__Container absolute bottom-0 left-[56px] hidden h-[310px] w-[245px] rounded-xl p-2">
                <div className="flex h-full w-full flex-col justify-between overflow-hidden rounded-xl">
                  <ProfileSection userName={fullName} avatar={url} />
                </div>
              </div>
            </div>
            <div>
              <p
                className={`select-none text-lg font-semibold ${mode === "light" ? "text-dark" : "text-gray-300"}`}
              >
                {username.length >= 13
                  ? `${username.slice(0, 13)}...`
                  : username}
              </p>
            </div>
          </div>
          <div className="flex-1 content-center text-end">
            <Switch
              checked={mode === "dark" ? true : false}
              value={mode === "dark" ? true : false}
              onCheckedChange={() => changeMode()}
              className="border border-dark shadow-md"
              thumbClassName="border border-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
