import { StyleSheet } from "react-native";
import { Image, Text, View } from "react-native";
import { color } from "../../theme";
import { IUser } from "../../models/user.model";

interface props {
  player: IUser | null,
  left?: boolean,
  right?: boolean
}
function PlayerStat({player, left, right}: props){
  const timePerTurn = 30;
  const ctnStyles = right ? styles.rightCtn : styles.leftCtn;
  return (
    <View>
      <View style={{...styles.main, ...ctnStyles}}>
        <Image style={styles.avatar} source={require('../../assets/logo/user.png')}/>
        <View>
          <Text> {player?.name} </Text>
          <Text style={{fontWeight: '500', color: color.blue}}> ({player?.elo})</Text>
        </View>
      </View>
      <View style={{padding: 4}}>
        <View style={{borderRadius: 4, overflow: 'hidden', backgroundColor: color.gray, width: '100%', height: 8}}>
          <View style={{backgroundColor: color.orange, height: '100%', width: `${(3 / timePerTurn) * 100}%`}}></View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    padding: 8
  },
  leftCtn: {
    flexDirection: 'row'
  },
  rightCtn: {
    flexDirection: 'row-reverse'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 36
  }
});

export default PlayerStat;