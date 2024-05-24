import { useCallback, useContext, useMemo } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IMenuItem } from '../../models/menu-item.model';
import { useNavigation } from '@react-navigation/native';
import { color } from '../../theme';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import api from '../../api';
import { SocketContext } from '../../contexts/Socket';
import { UserContext } from '../../contexts/User';

interface props {
  userId: number;
  handleDeleteAllMessages: () => Promise<any>;
}

function Menu({ userId, handleDeleteAllMessages }: props) {
  const navigation: any = useNavigation();
  const { user } = useContext(UserContext);
  const { client } = useContext(SocketContext);
  const handleDeleteFriend = async () => {
    api.post('/users/delete-friend/' + userId).then(() => {
      client?.emit('delete-friend', user?.id, userId);
      navigation.navigate('Home');
    });
  };
  const options: IMenuItem[] = useMemo(() => {
    return [
      {
        label: 'Xem trang cá nhân',
        icon: <FontAwesome5Icon name="user" size={16} />,
        command: () => {
          navigation.navigate('Info', { userId });
        },
      },
      {
        label: 'Xóa cuộc trò chuyện',
        icon: <AntDesignIcon name="delete" size={16} />,
        style: { color: color.crimson },
        command: () => {
          if (Platform.OS === 'web') {
            if (window.confirm('Bạn có muốn xóa toàn bộ cuộc trò chuyện này không?')) {
              handleDeleteAllMessages();
            }
          } else {
            Alert.alert('Xóa cuộc trò chuyện', `Bạn có muốn xóa toàn bộ cuộc trò chuyện này không?`, [
              { text: 'OK', onPress: handleDeleteAllMessages },
              { text: 'Cancel', onPress: () => {} },
            ]);
          }
        },
      },
      {
        label: 'Xóa bạn',
        icon: <AntDesignIcon name="deleteuser" size={16} />,
        style: { color: color.crimson, fontWeight: '600' },
        command: () => {
          if (Platform.OS === 'web') {
            if (window.confirm('Bạn có muốn xóa người bạn này không?')) {
              handleDeleteFriend();
            }
          } else {
            Alert.alert('Xóa bạn bè', `Bạn có muốn xóa người bạn này không?`, [
              { text: 'OK', onPress: handleDeleteFriend },
              { text: 'Cancel', onPress: () => {} },
            ]);
          }
        },
      },
    ];
  }, [userId]);
  return (
    <View style={styles.container}>
      {options.map((o, i) => (
        <TouchableOpacity key={i} style={styles.button} onPress={o.command}>
          <Text style={{ ...styles.text, ...o.style }}>
            {o.icon} {o.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    minWidth: 300,
    shadowColor: '#000000',
    marginTop: 40,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 12,
    backgroundColor: color.lightGray,
    borderTopWidth: 1,
    borderTopColor: color.gray,
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Menu;
