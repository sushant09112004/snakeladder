import GameConfig from "@/app/config/GameConfig";
import PlayerType, { WonPlayerType } from "@/types/PlayerType";
import { Dispatch } from "react";

import {
  diceRollSound,
  ladderSound,
  pieceMoveSound,
  snakeBiteSound,
  winningSound,
} from "./AudioPaths";
import { resolve } from "path";

export const rollTheDice = async (
  players: PlayerType[],
  currentPlayer: PlayerType,
  setCurrentPlayer: Dispatch<PlayerType>,
  setPlayers: Dispatch<PlayerType[]>,
  wonPlayers: WonPlayerType[],
  setWonPlayers: Dispatch<WonPlayerType[]>,
  setDiceValue: Dispatch<number>,
  setCurrentAndTargetSquare: Dispatch<{
    currentSquare?: number;
    targetSquare?: number;
  }>,
  setSquaresRemaining: Dispatch<number>,
  setShowWonPlayerModal: Dispatch<boolean>
): Promise<number> => {
  if (players.length === 0) {
    alert("Please Add Players to the game!");

    return 1;
  }

  let diceValue = 0;
  let x: { diceValue: number; shift: boolean } = await rollAndMove(
    players,
    currentPlayer,
    setCurrentPlayer,
    setPlayers,
    wonPlayers,
    setWonPlayers,
    setDiceValue,
    setCurrentAndTargetSquare,
    setSquaresRemaining
  );

  let hasWon = false;

  if (currentPlayer.currentSquare.index === 100) {
    hasWon = true;
    let wonPlayer = {
      rank: wonPlayers!.length + 1,
      player: currentPlayer,
    };
    setWonPlayers([...wonPlayers, wonPlayer]);
    console.log("setWonPlayers: ", wonPlayers);
    console.log("wonPlayer: ", wonPlayer);

    new Audio(winningSound).play();
    setShowWonPlayerModal(true);
    await delay(3000);
  }

  diceValue = x.diceValue;
  if (diceValue !== 6 && x.shift)
    shiftToNextPlayer(
      players,
      currentPlayer,
      setCurrentPlayer,
      setPlayers,
      setCurrentAndTargetSquare,
      wonPlayers,
      hasWon
    );

  return diceValue;
};

export const shiftToNextPlayer = (
  players: PlayerType[],
  currentPlayer: PlayerType,
  setCurrentPlayer: Dispatch<PlayerType>,
  setPlayers: Dispatch<PlayerType[]>,
  setCurrentAndTargetSquare: Dispatch<{
    currentSquare?: number;
    targetSquare?: number;
  }>,
  wonPlayers: WonPlayerType[],
  hasWon: boolean
) => {
  let nextPlayer: PlayerType | null = null;
  let prevPlayer: PlayerType | null = currentPlayer;

  let idx = 0;
  for (idx = 0; idx < players.length; idx++) {
    if (players[idx].id === currentPlayer.id) {
      break;
    }
  }

  if (idx >= players.length - 1) {
    nextPlayer = players[0];
  } else {
    nextPlayer = players[idx + 1];
  }

  if (nextPlayer.id === prevPlayer.id && hasWon) {
    setPlayers([]);
    setCurrentAndTargetSquare({
      currentSquare: 0,
      targetSquare: 0,
    });
    return;
  }

  let allPlayers = players.map((player) => {
    if (player.id === nextPlayer.id) {
      player.isMyTurn = true;
      setCurrentAndTargetSquare({
        currentSquare: player.currentSquare.index,
      });
      setCurrentPlayer(player);
    } else {
      player.isMyTurn = false;
    }
    return player;
  });

  setPlayers([...allPlayers]);

  console.log("out if: ", wonPlayers);
  console.log("out if: ", prevPlayer);

  if (hasWon) {
    console.log("in if: ", prevPlayer);
    console.log("in if: ", players);

    setPlayers([...players].filter((player) => player.id !== prevPlayer.id));
  }
};

const moveToSqaure = async (
  players: PlayerType[],
  setPlayers: Dispatch<PlayerType[]>,
  currentPlayer: PlayerType,
  setCurrentPlayer: Dispatch<PlayerType>,
  targetSquare: number,
  makeMoveSound: boolean,
  setSquaresRemaining: Dispatch<number>,
  rapidMove: boolean,
  promiseArray?: Promise<void>[]
): Promise<PlayerType> => {
  if (targetSquare > currentPlayer.currentSquare.index) {
    currentPlayer.currentSquare = currentPlayer.currentSquare.prevSquare!;
    // @ts-ignore
    setSquaresRemaining((prev) => prev - 1);
    if (makeMoveSound) {
      new Audio(pieceMoveSound).play();
    }
  } else {
    currentPlayer.currentSquare = currentPlayer.currentSquare.nextSqaure!;
    // @ts-ignore
    setSquaresRemaining((prev) => prev - 1);
    if (makeMoveSound) {
      new Audio(pieceMoveSound).play();
    }
  }

  let allPlayers = players.map((p) => {
    if (p.id === currentPlayer.id) {
      return currentPlayer;
    }
    return p;
  });

  setPlayers([...allPlayers]);

  let p: Promise<void>[] = [];

  if (currentPlayer.currentSquare.index !== targetSquare) {
    p.push(
      new Promise((resolve) => {
        setTimeout(
          async () => {
            await moveToSqaure(
              players,
              setPlayers,
              currentPlayer,
              setCurrentPlayer,
              targetSquare,
              makeMoveSound,
              setSquaresRemaining,
              rapidMove,
              promiseArray
            );
            resolve();
          },
          rapidMove ? GameConfig.rapidPieceMoveTime : GameConfig.pieceMoveTime
        );
      })
    );
  }

  await Promise.all(p);
  return currentPlayer;
};

const getDiceValue = async (
  setDiceValue: Dispatch<number>
): Promise<number> => {
  new Audio(diceRollSound).play();
  let diceTimer = setInterval(() => {
    setDiceValue(Math.floor(Math.random() * 6) + 1);
  }, 100);
  setTimeout(() => clearInterval(diceTimer), 1000);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.floor(Math.random() * 6) + 1);
    }, 1400);
  });
};

const rollAndMove = async (
  players: PlayerType[],
  currentPlayer: PlayerType,
  setCurrentPlayer: Dispatch<PlayerType>,
  setPlayers: Dispatch<PlayerType[]>,
  wonPlayers: WonPlayerType[] | undefined,
  setWonPlayers: Dispatch<WonPlayerType[]>,
  setDiceValue: Dispatch<number>,
  setCurrentAndTargetSquare: Dispatch<{
    currentSquare?: number;
    targetSquare?: number;
  }>,
  setSquaresRemaining: Dispatch<number>
): Promise<{ diceValue: number; shift: boolean }> => {
  setCurrentAndTargetSquare({
    currentSquare: currentPlayer.currentSquare.index,
    targetSquare: 0,
  });

  let diceValue: number = await getDiceValue(setDiceValue);
  setDiceValue(diceValue);

  let res = { diceValue, shift: true };

  let promises: Promise<void>[] = [];

  setSquaresRemaining(diceValue);

  setCurrentAndTargetSquare({
    currentSquare: currentPlayer.currentSquare.index,
    targetSquare: currentPlayer.currentSquare.index + diceValue,
  });

  if (diceValue + currentPlayer.currentSquare.index > 100) {
    setSquaresRemaining(0);
    return res;
  }

  await delay(GameConfig.pieceMoveTime * 2);

  await moveToSqaure(
    players,
    setPlayers,
    currentPlayer,
    setCurrentPlayer,
    currentPlayer.currentSquare.index + diceValue,
    true,
    setSquaresRemaining,
    false
  );

  await delay(GameConfig.pieceMoveTime * 2);

  if (currentPlayer.currentSquare.isSpecialSqaure) {
    setSquaresRemaining(
      Math.abs(
        currentPlayer.currentSquare.targetSquare! -
          currentPlayer.currentSquare.index
      )
    );
    setCurrentAndTargetSquare({
      currentSquare: currentPlayer.currentSquare.index,
      targetSquare: currentPlayer.currentSquare.targetSquare,
    });
    if (currentPlayer.currentSquare.nature === "snake") {
      new Audio(snakeBiteSound).play();
    } else {
      new Audio(ladderSound).play();
    }
    await moveToSqaure(
      players,
      setPlayers,
      currentPlayer,
      setCurrentPlayer,
      currentPlayer.currentSquare.targetSquare!,
      false,
      setSquaresRemaining,
      true,
      promises
    );

    await delay(GameConfig.pieceMoveTime * 2);
  }

  return new Promise((resolve) => {
    resolve({ diceValue, shift: true });
  });
};

function delay(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
