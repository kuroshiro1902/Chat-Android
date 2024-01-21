import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserContext } from "../contexts/User";
import { color } from "../theme";
import AppChessboard from "../components/AppChessboard";

function Home() {
  const {user} = useContext(UserContext)
  return ( 
    <>
    <View style={{padding: 8}}>
      <Text style={styles.title}>Xin chào, <Text style={styles.name}>{user!.name}</Text></Text>
      <AppChessboard />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'right',
  },
  name: {
    fontWeight: 'bold',
    color: color.blue
  }
})

export default Home;