import React, { Dispatch } from "react";

import GameConfig from "../config/GameConfig";

import PlayerType from "@/types/PlayerType";
import SquareType from "@/types/SquareType";

function AddPlayerForm({
  playerName,
  players,
  setCurrentPlayer,
  setPlayerName,
  setPlayers,
  tail,
}: {
  playerName: string;
  players: PlayerType[];
  setCurrentPlayer: Dispatch<PlayerType>;
  setPlayerName: Dispatch<string>;
  setPlayers: Dispatch<PlayerType[]>;
  tail: SquareType;
}) {
  const handleAddPlayer = () => {
    if (playerName.trim().length === 0) {
      alert("Player name cannot be empty");
      return;
    }

    if (players.length >= GameConfig.maxPlayerCount) {
      alert(`Only ${GameConfig.maxPlayerCount} players allowed!`);
      setPlayerName("");
      return;
    }

    let newPlayer: PlayerType = {
      id: players.length + 1,
      name: playerName,
      currentSquare: tail,
      isMyTurn: false,
    };

    if (players.length === 0) {
      newPlayer.isMyTurn = true;
      setCurrentPlayer(newPlayer);
    }

    setPlayers([...players, newPlayer]);
    setPlayerName("");
  };

  return (
    <div className="w-full flex items-center">
      <input
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        type="text"
        className="rounded"
        placeholder="Enter Name of New Player"
      />
      <button
        className="form-button bg-primary p-2 rounded ms-1 text-white"
        onClick={handleAddPlayer}
      >
        Add
      </button>
    </div>
  );
}

export default AddPlayerForm;
