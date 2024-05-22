import React, { Dispatch, useState } from "react";

import { WonPlayerType } from "@/types/PlayerType";

import "./modal.css";

const WonPlayerModal = ({
  wonPlayer,
  setShowWonPlayerModal,
}: {
  wonPlayer: WonPlayerType;
  setShowWonPlayerModal: Dispatch<boolean>;
}) => {
  return (
    <div className="absolute z-50 inset-160 h-1/2 w-1/2 top-12 left-[27%] bg-[#fff] p-16 flex flex-col items-center justify-center shadow-md border border-[#9c9c9c] rounded win-modal">
      <div className="modal-container bg-gray rounded-full flex flex-col items-center justify-center">
        <div className="modal-header flex flex-col items-center justify-center">
          <h1 className="text-2xl">{wonPlayer.player?.name} Won!!</h1>
          <button
            className="btn-close mt-10 bg-primary text-white py-2 px-3 rounded"
            onClick={() => setShowWonPlayerModal(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default WonPlayerModal;
