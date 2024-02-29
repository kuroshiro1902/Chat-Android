import { memo, useEffect, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Chessboard, {ChessboardRef} from "../Chessboard";
import { color } from "../theme";
import WhiteText from "./WhiteText";
import { PlayerColor } from "../Chessboard/types";
import {Move} from 'chess.js'
interface props {
  isStarted: boolean,
  isReady: boolean,
  playerColor: 'w' | 'b',
  isTurn?: boolean,
  move: Move | null,
  handleReady: () => void,
  handleStartCb: () => {
    canStart: boolean;
    handleStart: () => void;
  },
  handleMove: (move: Move) => void,
  handleEnd: (status: 'win' | 'draw') => void
}

const PLAYER_PROPS = {
  color: {
    b: 'black',
    w: 'white',
  },
  fen: {
    w: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    b: 'RNBKQBNR/PPPPPPPP/8/8/8/8/pppppppp/rnbkqbnr w KQkq - 0 1'
  }
}
function AppChessboard({isStarted, isReady, playerColor, isTurn, handleReady, handleStartCb, handleMove, handleEnd, move}: props) {
  const chessboardRef = useRef<ChessboardRef>(null);
  const {canStart, handleStart} = handleStartCb();
  useEffect(() => {
    // chessboardRef.current?.resetBoard(PLAYER_PROPS.fen[playerColor]);
  }, [playerColor, isStarted]);

  
  useEffect(() => {
    const handleAfterMove = async () => {
      if (!move) return;
      await chessboardRef.current?.move(move);
  
      const state = chessboardRef.current?.getState();
      if (!state) return;

      if (move.color !== playerColor) return;
  
      const {in_checkmate, in_draw, insufficient_material, in_threefold_repetition, in_stalemate} = state;
  
      if(in_checkmate) {
        handleEnd('win');
        return;
      }
      if(in_draw || insufficient_material || in_threefold_repetition || in_stalemate){
        handleEnd('draw');
        return;
      }
    }
    handleAfterMove();
  }, [move])
  
  return ( 
    <View style={styles.container}>
      {!isStarted && <View style={styles.overlay}>
        <Pressable style={styles.readyBtn} onPress={handleReady}>
          <WhiteText style={{fontSize: 24}}>{isReady ? 'Không sẵn sàng' : 'Sẵn sàng'}</WhiteText>
        </Pressable>
        {canStart &&
          <Pressable style={styles.startBtn} onPress={handleStart}>
            <WhiteText style={{fontSize: 26}}>Bắt đầu</WhiteText>
          </Pressable>
        }
      </View>}
      {!isTurn && 
        <View style={styles.notTurnOverlay}></View>
      }
      <Chessboard
        onMove={({move})=> {handleMove(move)}}
        ref={chessboardRef} boardSize={window.innerWidth}
        // fen={PLAYER_PROPS.fen[playerColor]}
        playerColor={PLAYER_PROPS.color[playerColor] as PlayerColor}
      />
    </View>
   );
}

export default memo(AppChessboard);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    zIndex: 2,
    backgroundColor: '#33333345',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notTurnOverlay: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyBtn: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: color.green,
    borderWidth: 2,
    borderColor: color.blue
  },
  startBtn: {
    marginTop: 4,
    padding: 6,
    borderRadius: 4,
    backgroundColor: color.orange,
    borderWidth: 2,
    borderColor: color.blue
  }
});