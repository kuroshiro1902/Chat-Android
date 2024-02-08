import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import Chessboard, { ChessboardRef } from "react-native-chessboard";

interface props {
  isStarted: boolean
}
function AppChessboard({isStarted}: props) {
  const chessboardRef = useRef<ChessboardRef>(null);
  return ( 
    <View style={styles.container}>
      {/* {isStarted && <View style={styles.overlay}></View>} */}
      <Chessboard onMove={(info)=> console.log(info.move)} ref={chessboardRef} boardSize={window.innerWidth}/>
    </View>
   );
}

export default AppChessboard;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, bottom: 0, right: 0,
    zIndex: 1,
    backgroundColor: '#333',
    opacity: 0.3
  }
});