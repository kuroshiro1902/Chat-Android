import { Image, StyleSheet, Text } from 'react-native';
import { TouchableOpacity, View } from 'react-native';
import { IUser } from '../../models/user.model';
import { color, theme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { colorish } from '../../utils/colorish.util';

interface props {
  item: IUser;
}

function FriendSearchItem({ item }: props) {
  const navigation: any = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Info', { userId: item.id });
      }}
    >
      <View style={styles.block}>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: 8 }}>
          <View style={theme.avatar} id={`avatar-${item.id}`}>
            <Image style={{ width: 44, height: 44 }} source={require('../../assets/logo/user.png')}></Image>
          </View>
          <View style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.friendName}>{item.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  block: {
    height: 68,
    backgroundColor: colorish(color.white),
    padding: 8,
    gap: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: color.lightGray,
    borderBottomWidth: 1,
  },
  friendName: {
    fontWeight: '500',
    fontSize: 18,
  },
  header: {
    display: 'flex',
    // justifyContent: 'space-between'
    flexDirection: 'column',
  },
  title: {
    textAlign: 'right',
    fontSize: 18,
    padding: 8,
  },
  name: {
    fontWeight: 'bold',
    color: color.blue,
  },
  mainCtn: {
    paddingVertical: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  button: {
    ...theme.button,
    width: '50%',
    paddingVertical: 16,
  },
  buttonPressed: {
    ...theme.buttonPressed,
    width: '50%',
    paddingVertical: 16,
  },
  // text: {
  //   color: 'inherit',
  //   textAlign: 'center',
  //   fontSize: 20,
  // },
});

export default FriendSearchItem;
