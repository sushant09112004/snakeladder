enum Nature {
  snake,
  ladder,
}

export default interface SquareType {
  index: number;
  isSpecialSqaure?: boolean;
  nature?: string;
  targetSquare?: number;
  nextSqaure?: SquareType;
  prevSquare?: SquareType;
}
