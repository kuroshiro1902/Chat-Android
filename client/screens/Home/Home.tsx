import { useContext, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../../contexts/User";
import { color, theme } from "../../theme";
import Loading from "../../components/Loading";
import { GameContext } from "../../contexts/Game";

function Home({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useContext(UserContext);
  const { joinRoom } = useContext(GameContext);
  const createRoom = () => { 
    joinRoom();
  }
  return ( 
    <>
    {isLoading && <Loading />}
    <View style={{padding: 8}}>
      <Text style={styles.header}>
        <Text style={styles.title}>Xin chào, <Text style={styles.name}>{user!.name}</Text></Text>
        <Text style={styles.title}>Elo: <Text style={styles.name}>{user!.elo}</Text></Text>
      </Text>
      {/* <AppChessboard /> */}
      <View style={styles.mainCtn}>
        <Pressable style={({pressed})=>pressed? styles.buttonPressed : styles.button }>
          <Text style={styles.text}>Vào phòng</Text>
        </Pressable>
        <Pressable onPress={createRoom} style={({pressed})=>pressed? styles.buttonPressed : styles.button }>
          <Text style={styles.text}>Tạo phòng</Text>
        </Pressable>
        <Pressable style={({pressed})=>pressed? styles.buttonPressed : styles.button }>
          <Text style={styles.text}>Tìm phòng</Text>
        </Pressable>
        <Pressable style={({pressed})=>pressed? styles.buttonPressed : styles.button }>
          <Text style={styles.text}>Xem phòng</Text>
        </Pressable>
        <Pressable style={({pressed})=>pressed? styles.buttonPressed : styles.button }>
          <Text style={styles.text}>Cài đặt</Text>
        </Pressable>
        <Pressable style={({pressed})=>pressed? styles.buttonPressed : styles.button }>
          <Text style={styles.text}>Thông tin</Text>
        </Pressable>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  header:{
    display: 'flex',
    // justifyContent: 'space-between'
    flexDirection: 'column',
  },
  title: {
    textAlign: 'right',
    fontSize: 18
  },
  name: {
    fontWeight: 'bold',
    color: color.blue
  },
  mainCtn: {
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  button: {
    ...theme.button,
    width: '50%',
    paddingVertical: 16
  },
  buttonPressed: {
    ...theme.buttonPressed,
    width: '50%',
    paddingVertical: 16
  },
  text: {
    color: 'inherit',
    textAlign: 'center',
    fontSize: 20
  }
})

export default Home;