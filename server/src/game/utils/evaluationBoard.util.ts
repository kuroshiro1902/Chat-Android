import { Chess, Color, Move } from 'chess.js';
import { checkStatus } from './checkStatus.util';
import { EGameStatus } from '../constants/status.constant';
import { WEIGHTS } from '../values/Weight.value';
import { PST_OPPONENT, PST_SELF } from '../values/Position.value';

export function evaluateBoard(
  chess: Chess,
  move: Move,
  prevSum: number,
  color: Color
) {
  const { status } = checkStatus(chess);

  if (status === EGameStatus.CHECK_MATE) {
    // Opponent is in checkmate (good for player[color])
    if (move.color === color) {
      return 10 ** 10;
    }
    // Player[color]’s king is in checkmate (bad for player[color])
    else {
      return -(10 ** 10);
    }
  }

  if (
    status === EGameStatus.DRAW ||
    status === EGameStatus.THREE_FOLD_REPETITION ||
    status === EGameStatus.STALE_MATE
  ) {
    return 0;
  }

  if (status === EGameStatus.CHECK) {
    // Opponent is in check
    if (move.color === color) {
      prevSum += 50;
    }
    // Player[color]’s king is in check
    else {
      prevSum -= 50;
    }
  }

  let from = [
    8 - parseInt(move.from[1]),
    move.from.charCodeAt(0) - 'a'.charCodeAt(0),
  ];
  let to = [
    8 - parseInt(move.to[1]),
    move.to.charCodeAt(0) - 'a'.charCodeAt(0),
  ];

  if (!!move.captured) {
    // Opponent piece was captured (good for us)
    if (move.color === color) {
      prevSum +=
        WEIGHTS[move.captured] +
        PST_OPPONENT[move.color][move.captured][to[0]][to[1]];
    }
    // Our piece was captured (bad for us)
    else {
      prevSum -=
        WEIGHTS[move.captured] +
        PST_SELF[move.color][move.captured][to[0]][to[1]];
    }
  }

  if (move.flags.includes('p')) {
    // NOTE: promote to queen for simplicity
    move.promotion = 'q';

    // Our piece was promoted (good for us)
    if (move.color === color) {
      prevSum -=
        WEIGHTS[move.piece] +
        PST_SELF[move.color][move.piece][from[0]][from[1]];
      prevSum +=
        WEIGHTS[move.promotion] +
        PST_SELF[move.color][move.promotion][to[0]][to[1]];
    }
    // Opponent piece was promoted (bad for us)
    else {
      prevSum +=
        WEIGHTS[move.piece] +
        PST_SELF[move.color][move.piece][from[0]][from[1]];
      prevSum -=
        WEIGHTS[move.promotion] +
        PST_SELF[move.color][move.promotion][to[0]][to[1]];
    }
  } else {
    // The moved piece still exists on the updated board, so we only need to update the position value
    if (move.color !== color) {
      prevSum += PST_SELF[move.color][move.piece][from[0]][from[1]];
      prevSum -= PST_SELF[move.color][move.piece][to[0]][to[1]];
    } else {
      prevSum -= PST_SELF[move.color][move.piece][from[0]][from[1]];
      prevSum += PST_SELF[move.color][move.piece][to[0]][to[1]];
    }
  }
  return prevSum;
}
