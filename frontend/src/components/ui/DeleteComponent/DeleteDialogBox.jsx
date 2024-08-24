import React from "react";
import "./style.css";
import useApp from "@/context/context";

function DeleteDialogBox({ setDelete, setShowDelete, type, timer = null }) {
  const { mode } = useApp();
  return (
    <div
      className={`card ${mode === "dark" ? "bg-darkCard text-white" : "bg-lightNav text-stone-900"}`}
    >
      <div className="card-content">
        <p className="card-heading">Delete file?</p>
        {timer ? (
          <div>
            <p className="card-subheading">
              Are you sure you want to delete this {type}? You can't undo this.
            </p>
            <p className="text-start">Close in {timer} seconds.</p>
          </div>
        ) : (
          <p className="card-description">
            Are you sure you want to delete this {type}? You can't undo this
            action.
          </p>
        )}
      </div>
      <div className="card-button-wrapper">
        <button
          className={`card-button secondary ${mode === "dark" ? "bg-darkBtn text-white" : "bg-gray-400 text-white"}`}
          onClick={() => setShowDelete(false)}
        >
          Cancel
        </button>
        <button className="card-button primary" onClick={() => setDelete(true)}>
          Delete
        </button>
      </div>
      <button className="exit-button" onClick={() => setShowDelete(false)}>
        <svg height="20px" viewBox="0 0 384 512">
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
        </svg>
      </button>
    </div>
  );
}

export default DeleteDialogBox;
