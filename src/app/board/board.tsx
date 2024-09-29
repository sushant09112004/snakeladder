"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Node } from "../../utilities/CommonFunctions";
import PlayerType, { WonPlayerType } from "@/types/PlayerType";
import SquareType from "@/types/SquareType";

import GameConfig from "../config/GameConfig";
import UIConfig from "../config/UIConfig";

import dice1 from "$/public/assets/dice-faces/1.png";
import dice2 from "$/public/assets/dice-faces/2.png";
import dice3 from "$/public/assets/dice-faces/3.png";
import dice4 from "$/public/assets/dice-faces/4.png";
import dice5 from "$/public/assets/dice-faces/5.png";
import dice6 from "$/public/assets/dice-faces/6.png";
import BgImage from '@/assets/gateway2.jpg'
import {
  createLinkedList,
  getArrayFromList,
  generateBoard,
} from "../../utilities/CommonFunctions";

import { rollTheDice } from "@/utilities/GameControls";

import "./styles.css";
import AddPlayerForm from "../AddPlayerForm/AddPlayerForm";
import WonPlayerModal from "../Modals/WonPlayerModal";

function Board() {
  const { head, tail } = createLinkedList();
  let arrayList: SquareType[] = getArrayFromList(head);
  let board: SquareType[][] = generateBoard(arrayList);

  const [players, setPlayers] = useState<PlayerType[]>([]);
  const [playerName, setPlayerName] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>();

  const [wonPlayers, setWonPlayers] = useState<WonPlayerType[]>([]);

  const [diceValue, setDiceValue] = useState(1);

  let diceFaces = [dice1, dice2, dice3, dice4, dice5, dice6];

  const [currentAndTargetSquare, setCurrentAndTargetSquare] = useState<{
    currentSquare?: number;
    targetSquare?: number;
  }>({
    currentSquare: 0,
    targetSquare: 0,
  });

  const [squaresRemaining, setSquaresRemaining] = useState(0);

  const [showWonPlayerModal, setShowWonPlayerModal] = useState(false);
  

  return (
    <>
      <main className="main w-screen h-screen p-1 ">
        <div className="flex h-full">
          <div className="w-1/4 flex flex-col p-1">
            <p className="bg-[#f2f2f2] w-full p-1 rounded">Players</p>
            <div className="h-1/3 p-2 flex flex-col justify-between">
              <div className="players w-1/2">
                {players.map((p, i) => {
                  return (
                    <div
                      className={`player flex justify-between items-center px-2 py-1 rounded ${
                        p.isMyTurn ? "bg-[#c8fffd]" : ""
                      }`}
                      key={i}
                    >
                      <p>{`${p.name}`}</p>
                      {p.isMyTurn && (
                        <div
                          className={`rounded-full h-4 w-4 bg-player${p.id}color`}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <AddPlayerForm
                playerName={playerName}
                players={players}
                setPlayerName={setPlayerName}
                setPlayers={setPlayers}
                setCurrentPlayer={setCurrentPlayer}
                tail={tail}
              />
            </div>
            <div className="h-1/3 p-1 border-b border-[#f2f2f2]">
              <p className="bg-[#f2f2f2] w-full p-1 rounded">Winners</p>
              {wonPlayers.map((p, i) => {
                return <p key={i}>{p.rank + " -> " + p.player?.name}</p>;
              })}
            </div>
            <div
              className={`container mt-2 h-1/3 p-2 flex flex-col justify-evenly rounded bg-player${currentPlayer?.id}color`}
            >
              <div className="bg-gray w-full flex flex-col items-center justify-between">
                <div className="diceVal h-20 w-20">
                  <Image
                    className="h-full w-full"
                    src={diceFaces[diceValue - 1]}
                    alt="dice"
                  />
                </div>
                {players.length > 0 && (
                  <button
                    className={`bg-secondary p-2 rounded text-white mt-2 ${
                      squaresRemaining !== 0 ? "bg-[#535353]" : ""
                    }`}
                    onClick={async () =>
                      setDiceValue(
                        await rollTheDice(
                          players,
                          currentPlayer!,
                          setCurrentPlayer,
                          setPlayers,
                          wonPlayers,
                          setWonPlayers,
                          setDiceValue,
                          setCurrentAndTargetSquare,
                          setSquaresRemaining,
                          setShowWonPlayerModal
                        )
                      )
                    }
                    disabled={squaresRemaining !== 0}
                  >
                    Roll The Dice
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-3/4 flex flex-col items-center p-1 "
          style={{
            background:
              'linear-gradient(45deg, #F9A75B 0%, #EAEAEA 33.33%, #FFFFFF 66.67%, #A8E1A2 100%)',
            boxShadow: '-10px 10px 15px rgba(0, 0, 0, 0.2)', // Custom shadow on bottom and left
          }}
         
          >
            <div className="flex items-center justify-between px-2 mt-5 w-full">
              <p className="text-2xl font-semibold">Snakes & Ladders</p>
              {(players.length !== 0 || wonPlayers.length > 0) && (
                <button
                  className="bg-rose px-3 py-2 rounded"
                  onClick={() => window.location.reload()}
                >
                  Reset Game
                </button>
              )}
            </div>
            <div className="board mt-5">
              {board.map((val, idx) => {
                return (
                  <div className="row" key={idx}>
                    {val.map((block) => {
                      return (
                        <div
                          className={`block ${
                            block.isSpecialSqaure
                              ? block.nature === "snake"
                                ? "snakeBgImg"
                                : "ladderBgImg"
                              : ""
                          }`}
                          key={block!.index}
                          style={{
                            backgroundColor:
                              currentAndTargetSquare.currentSquare ===
                              block.index
                                ? UIConfig.playerColor.secondary
                                : currentAndTargetSquare.targetSquare ===
                                  block.index
                                ? UIConfig.playerColor.tertiary
                                : "",
                          }}
                        >
                          {block!.index}

                          {block.isSpecialSqaure && (
                            <span
                              className={`text-rose ${
                                block.nature === "snake"
                                  ? "text-rose"
                                  : "text-grape"
                              } font-medium`}
                            >
                              {" ->" + block.targetSquare}
                            </span>
                          )}

                          <div className="player-dots flex items-center">
                            {players.map((player: PlayerType) => {
                              if (player.currentSquare.index === block!.index) {
                                return (
                                  <div
                                    className={`player-circle me-1 rounded-full ${
                                      player.isMyTurn
                                        ? "border-solid border-2 h-5 w-5"
                                        : "h-4 w-4"
                                    }`}
                                    style={{
                                      background:
                                        UIConfig.playerColor[
                                          player.id as keyof typeof UIConfig.playerColor
                                        ],
                                    }}
                                    key={player.id}
                                  ></div>
                                );
                              }
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {showWonPlayerModal && (
        <WonPlayerModal
          wonPlayer={wonPlayers[wonPlayers.length - 1]}
          // wonPlayer={{
          //   player: {
          //     name: "test",
          //     id: 1,
          //     currentSquare: { index: 99 },
          //     isMyTurn: true,
          //   },
          // }}
          setShowWonPlayerModal={setShowWonPlayerModal}
        />
      )}
    </>
  );
}

export default Board;
