import GameConfig from "@/app/config/GameConfig";
import SquareType from "@/types/SquareType";

export type Node = {
  index: number;
  next?: Node;
  prev?: Node;
  properties?: SquareType;
} | null;

export const createLinkedList = (): { head: SquareType; tail: SquareType } => {
  let head: SquareType = { index: 100 };
  let current: SquareType = head;
  let tail: SquareType = { index: 1 };

  for (let i = 100; i >= 1; i--) {
    //TODO: Add remaining properties to the square
    let properties: SquareType = { index: i };

    let node: SquareType = {
      index: i,
    };

    let key = i as keyof typeof GameConfig.boardStructure;

    if (
      GameConfig.boardStructure[key] &&
      GameConfig.boardStructure[key].isSpacialSquare
    ) {
      node.isSpecialSqaure = true;
      node.nature = GameConfig.boardStructure[key].nature;
      node.targetSquare = GameConfig.boardStructure[key].targetSquare;
    }

    if (i === 100) {
      current = node;
      head = node;
    } else {
      node.prevSquare = current;
      current!.nextSqaure = node;
      current = node;
      if (current) tail = current;
    }
  }

  return { head, tail };
};

export const getArrayFromList = (head: SquareType): SquareType[] => {
  let arrayList: SquareType[] = [];
  let ptr: SquareType | undefined = head;
  while (ptr) {
    arrayList.push(ptr);
    ptr = ptr.nextSqaure;
  }
  return arrayList;
};

export const generateBoard = (arrayList: SquareType[]): SquareType[][] => {
  let startIndex = 0,
    row = 1;
  let board: SquareType[][] = [];
  for (let i = 0; i < 10; i++) {
    let tempRow: SquareType[] = [];
    if (row % 2 !== 0) {
      for (let j = 0; j < 10; j++) {
        tempRow.push(arrayList[startIndex]);
        startIndex += 1;
      }
    } else {
      startIndex += 9;
      for (let j = 0; j < 10; j++) {
        tempRow.push(arrayList[startIndex]);
        startIndex -= 1;
      }
      startIndex += 11;
    }
    board.push(tempRow);
    row += 1;
  }

  return board;
};

const printBoard = (board: SquareType[][]) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      console.log(board[i][j]);
    }
    console.log("||");
  }
};
