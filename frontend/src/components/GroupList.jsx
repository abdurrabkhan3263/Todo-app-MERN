import React, { useEffect, useRef, useState } from "react";
import useApp from "@/context/context";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, Link, useParams } from "react-router-dom";
import TodoApi from "@/Api/Todo";
import { toast } from "sonner";
import { Navigation } from "lucide-react";
import { Delete, Edit } from "@/assets/icons";

function GroupList({ title, content, id, color, groupId }) {
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();
  const client = useQueryClient();
  const headerBox = useRef(null);
  const { mode } = useApp();

  const deleteMutation = useMutation({
    mutationKey: ["muDelete"],
    mutationFn: async (id) => TodoApi.deleteGroupList(groupId, id),
    onSuccess: (result) => {
      toast.success(result.message);
      client.invalidateQueries({ queryKey: ["allGroupList"] });
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(id);
  };

  const handleMouseEnter = () => {
    headerBox.current.classList.remove("hidden");
    headerBox.current.classList.add("activeBox");
  };
  const handleMouseLeave = () => {
    headerBox.current.classList.add("hidden");
    headerBox.current.classList.remove("activeBox");
  };

  return (
    <>
      {showDelete && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="flex h-[20%] w-[20%] items-center justify-between bg-white px-4">
            <button
              onClick={() => setShowDelete(false)}
              className="rounded-lg border px-5 py-1 hover:bg-lightNav"
            >
              Close
            </button>
            <button
              className="rounded-lg border px-5 py-1 hover:bg-lightNav"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <div
        className={`wow relative flex h-[300px] w-full flex-col overflow-hidden rounded-2xl text-white transition-all hover:-translate-y-1 hover:scale-105 ${mode === "dark" ? `shadow-lg shadow-light` : "shadow-lg shadow-dark"} p-4`}
        style={{
          backgroundColor:
            mode === "dark"
              ? color?.darkColor || "#322727"
              : color?.lightColor || "#9c9c9c",
        }}
        onMouseOver={handleMouseEnter}
        onMouseOut={handleMouseLeave}
      >
        <div
          className="headerBox absolute right-1/2 top-1/2 hidden h-full w-full -translate-y-1/2 translate-x-1/2"
          ref={headerBox}
        >
          <div className="flex items-center justify-between p-3">
            <button
              className="fit relative h-[40px] w-[40px] rounded-full bg-slate-200 p-2 text-stone-700 hover:bg-lightNav hover:text-white"
              onClick={() => navigate(`edit-list/${id}`)}
            >
              <Edit className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2" />
            </button>
            <button
              className="fit rounded-full bg-slate-200 p-2 text-stone-700 hover:bg-lightNav hover:text-white"
              onClick={() => setShowDelete(true)}
            >
              <Delete />
            </button>
          </div>
          <div className="mb-8 flex w-full flex-1 items-center justify-center">
            <Link className="navBtn rotate-[25deg] p-5" to={`/todo/${id}`}>
              <Navigation height={"35px"} width={"35px"} />
            </Link>
          </div>
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="h-[60%] overflow-hidden">
            <textarea
              value={title?.length > 12 ? `${title.slice(0, 12)}....` : title}
              name="listName"
              disabled
              className="mt-2.5 h-full w-full resize-none bg-transparent text-center text-6xl font-bold outline-none"
            ></textarea>
          </div>
          <div className="h-[40%] overflow-hidden">
            <textarea
              value={content}
              name="content"
              disabled
              className="h-full w-full resize-none bg-transparent pt-2 text-xl font-medium outline-none"
            ></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

export default GroupList;
