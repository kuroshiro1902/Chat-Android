import { useRef } from "react";
import { View } from "react-native";
import Chessboard, { ChessboardRef } from "react-native-chessboard";

function AppChessboard() {
  const chessboardRef = useRef<ChessboardRef>(null);
  return ( 
    <View>
      <Chessboard onMove={(info)=> console.log(info.move)} ref={chessboardRef} boardSize={window.innerWidth-16}/>
    </View>
   );
}

export default AppChessboard;