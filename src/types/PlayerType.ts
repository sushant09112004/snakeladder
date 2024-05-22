import SquareType from "./SquareType";

export default interface PlayerType {
  id: number;
  name: string;
  currentSquare: SquareType;
  isMyTurn: boolean;
}

export interface WonPlayerType {
  rank?: number;
  player?: PlayerType;
}
