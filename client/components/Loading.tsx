import { Image, StyleSheet, View } from "react-native";

function Loading() {
  return ( 
    <View style={styles.container}>
      <Image source={require('../assets/loading.gif')} />
    </View>
   );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    top: 0, bottom: 0, right: 0, left: 0,
    backgroundColor: '#adb6b680'
  }
})

export default Loading;