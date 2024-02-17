import { Pressable, StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign'
import { color } from "../theme";
function Overlay({children, handleClose}: any) {
  return ( 
    <View style={styles.container}>
      <View style={{marginTop: -120, position: 'relative'}}>
        {children}
        <Pressable style={styles.closeBtn} onPress={handleClose}>
          <Icon name='closecircle' size={24} style={{color: color.red}} />
        </Pressable>
      </View>
    </View>
   );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, bottom: 0, left: 0, right:0,
    backgroundColor: '#00000080',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999
  },
  closeBtn: {
    position: "absolute",
    right: -4, top: -4,
  }
})

export default Overlay;