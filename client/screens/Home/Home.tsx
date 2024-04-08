import { useCallback, useContext, useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { UserContext } from "../../contexts/User";
import { color, theme } from "../../theme";
import Loading from "../../components/Loading";
import { GameContext } from "../../contexts/Game";
import Overlay from "../../components/Overlay";
import WhiteText from "../../components/WhiteText";

function Home({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  
  return ( 
    <>
    {isLoading && <Loading />}
    <View style={{padding: 8}}>
      <View style={styles.mainCtn}>
        <Pressable style={({pressed})=>pressed? styles.buttonPressed : styles.button}>
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