import { Pressable } from "react-native";
import FeatherIcon from 'react-native-vector-icons/Feather';
import { styles } from "./styles";
import WhiteText from "../../components/WhiteText";
import { color } from "../../theme";

function BottomMenuBtn({title, iconName, onPress}: {title: string, iconName: string, onPress?: (event: any) => void}){
  return (
    <Pressable style={styles.bottomMenuBtn} onPress={onPress}>
      <FeatherIcon name={iconName} size={16} style={{color: color.white, textAlign: 'center'}} />
      <WhiteText style={{fontSize: 12}}>{title}</WhiteText>
    </Pressable>
  )
}

export default BottomMenuBtn;