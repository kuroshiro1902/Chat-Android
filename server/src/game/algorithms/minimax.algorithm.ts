import { Chess, Color, Move } from 'chess.js';
import { evaluateBoard } from '../utils/evaluationBoard.util';

let positionCount = 0;

/**
 *
 * @param chess The chess object.
 * @param depth The depth of the recursive tree of all possible moves (i.e. height limit).
 * @param alpha Alpha value of A-B cutoff
 * @param beta Beta value of A-B cutoff
 * @param isMaximizingPlayer True if the current layer is maximizing, false otherwise.
 * @param sum The sum (evaluation) so far at the current layer.
 * @param color The color of the current player.
 * @returns The best move at the root of the current subtree.
 */
export function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  sum: number,
  color: Color
): {
  bestMove: Move | null;
  sum: number;
  positionCount: number;
} {
  positionCount++;
  let children$ = chess.moves({ verbose: true });

  // Sort moves randomly, so the same move isn't always picked on ties
  children$.sort(function (a, b) {
    return 0.5 - Math.random();
  });

  let currMove: Move;
  // Maximum depth exceeded or node is a terminal node (no children)
  if (depth === 0 || children$.length === 0) {
    const ans = { bestMove: null, sum, positionCount };
    positionCount = 0;
    return ans;
  }

  // Find maximum/minimum from list of 'children' (possible moves)
  let maxValue$ = Number.NEGATIVE_INFINITY;
  let minValue$ = Number.POSITIVE_INFINITY;
  let bestMove: Move | null = null;
  for (let _move of children$) {
    currMove = _move;
    // Note: in our case, the 'children' are simply modified game states
    let _currPrettyMove = chess.move(currMove);

    let _newSum = evaluateBoard(chess, _currPrettyMove, sum, color);
    var { bestMove: childBestMove, sum: childValue } = minimax(
      chess,
      depth - 1,
      alpha,
      beta,
      !isMaximizingPlayer,
      _newSum,
      color
    );

    chess.undo();

    if (isMaximizingPlayer) {
      if (childValue > maxValue$) {
        maxValue$ = childValue;
        bestMove = _currPrettyMove;
      }
      if (childValue > alpha) {
        alpha = childValue;
      }
    } else {
      if (childValue < minValue$) {
        minValue$ = childValue;
        bestMove = _currPrettyMove;
      }
      if (childValue < beta) {
        beta = childValue;
      }
    }

    // Alpha-beta pruning
    if (alpha >= beta) {
      break; //cut off
    }
  }

  if (isMaximizingPlayer) {
    return { bestMove, sum: maxValue$, positionCount };
  } else {
    return { bestMove, sum: minValue$, positionCount };
  }
}
