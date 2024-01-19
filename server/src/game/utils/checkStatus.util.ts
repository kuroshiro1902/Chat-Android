import { Chess } from 'chess.js';
import { EGameStatus } from '../constants/status.constant';

export function checkStatus(chess: Chess): {
  isStop: boolean;
  status: EGameStatus;
} {
  let isStop = true;
  let status = EGameStatus.NORMAL;
  if (chess.isCheckmate()) {
    status = EGameStatus.CHECK_MATE;
  } else if (chess.isInsufficientMaterial()) {
    status = EGameStatus.INSUFFICIENT_MATERIAL;
  } else if (chess.isThreefoldRepetition()) {
    status = EGameStatus.THREE_FOLD_REPETITION;
  } else if (chess.isStalemate()) {
    status = EGameStatus.STALE_MATE;
  } else if (chess.isDraw()) {
    status = EGameStatus.DRAW;
  } else if (chess.isCheck()) {
    EGameStatus.CHECK;
    isStop = false;
  } else {
    isStop = false;
  }
  return { isStop, status };
}
