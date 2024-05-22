const GameConfig = {
  maxPlayerCount: 4,
  pieceMoveTime: 200,
  rapidPieceMoveTime: 100,
  boardStructure: {
    2: {
      isSpacialSquare: true,
      nature: "ladder",
      targetSquare: 38,
    },
    4: {
      isSpacialSquare: true,
      nature: "ladder",
      targetSquare: 14,
    },
    8: {
      isSpacialSquare: true,
      nature: "ladder",
      targetSquare: 30,
    },
    21: {
      isSpacialSquare: true,
      nature: "ladder",
      targetSquare: 42,
    },
    28: {
      isSpacialSquare: true,
      nature: "ladder",
      targetSquare: 76,
    },
    32: {
      isSpacialSquare: true,
      nature: "snake",
      targetSquare: 10,
    },
    36: {
      isSpacialSquare: true,
      nature: "snake",
      targetSquare: 6,
    },
    48: {
      isSpacialSquare: true,
      nature: "snake",
      targetSquare: 26,
    },
    50: {
      isSpacialSquare: true,
      nature: "ladder",
      targetSquare: 67,
    },
    62: {
      isSpacialSquare: true,
      nature: "snake",
      targetSquare: 18,
    },
    71: {
      isSpacialSquare: true,
      nature: "ladder",
      targetSquare: 92,
    },
    80: {
      isSpacialSquare: true,
      nature: "ladder",
      targetSquare: 99,
    },
    88: {
      isSpacialSquare: true,
      nature: "snake",
      targetSquare: 24,
    },
    95: {
      isSpacialSquare: true,
      nature: "snake",
      targetSquare: 56,
    },
    97: {
      isSpacialSquare: true,
      nature: "snake",
      targetSquare: 78,
    },
  },
};

export default GameConfig;
