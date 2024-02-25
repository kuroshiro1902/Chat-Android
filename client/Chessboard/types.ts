/* eslint-disable no-undef */

import type { ChessInstance, Square } from 'chess.js';

type PlayerColor = 'black' | 'white';

type Player = ReturnType<ChessInstance['turn']>;
type Type = 'q' | 'r' | 'n' | 'b' | 'k' | 'p';
type PieceType = `${Player}${Type}`;

type PiecesType = Record<PieceType, ReturnType<typeof require>>;
type Vector<T = number> = {
  x: T;
  y: T;
};

type ChessMove = {
  from: Square;
  to: Square;
};

type MoveType = { from: Square; to: Square };

export type {
  PlayerColor,
  Player,
  Type,
  PieceType,
  PiecesType,
  Vector,
  ChessMove,
  MoveType,
};
