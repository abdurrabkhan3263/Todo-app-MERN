import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import TodoApi from "@/Api/Todo";
import useApp from "@/context/context";
import { GroupList as GroupListCard } from "@/components/index.js";
import { Outlet } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function GroupList() {
  const { id } = useParams();
  const { mode } = useApp();
  const groupListHeading = useRef(null);

  const {
    data: { data } = "",
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allGroupList"],
    queryFn: async () => await TodoApi.getGroupList(id),
  });

  useGSAP(() => {
    gsap.from(groupListHeading.current, {
      duration: 0.5,
      y: 100,
      ease: "power3.out",
    });
  }, [data, id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex h-full w-full flex-col">
        <div className="fixed bottom-1/2 right-[42%] z-[70] translate-x-1/2 translate-y-1/2">
          <Outlet />
        </div>
        <div className="overflow-hidden">
          <div
            className={`text-6xl font-bold ${mode === "dark" ? "text-darkText" : "text-dark"}`}
            ref={groupListHeading}
          >
            {data?.name || ""}
          </div>
        </div>
        <div className="mt-6 grid h-full w-full flex-1 grid-cols-5 gap-6">
          {Array.isArray(data?.lists) &&
            data?.lists.length > 0 &&
            data?.lists.map(({ _id, listName, description, theme }) => (
              <div key={_id}>
                <GroupListCard
                  groupId={id}
                  title={listName}
                  content={description || ""}
                  color={theme}
                  id={_id}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default GroupList;
