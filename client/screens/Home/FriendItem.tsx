import { useCallback, useContext, useEffect, useState } from 'react';
import { IRoomInput } from '../Room/models/room-input.model';
import { IMessage } from '../../models/message.model';
import api from '../../api';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, theme } from '../../theme';
import { UserContext } from '../../contexts/User';
import { useNavigation } from '@react-navigation/native';
import { IUser } from '../../models/user.model';

const FriendItem = ({ item }: { item: IUser }) => {
  const navigation: any = useNavigation();
  const { user, onlineFriendIds, setUser } = useContext(UserContext);
  const roomInput: IRoomInput = { receiverId: item.id, name: item.name };
  const [message, setMessage] = useState<IMessage | undefined>();

  const getMessages = useCallback(
    async (options?: any) => {
      const { data } = await api.post<{ data: IMessage[] }>('/messages/get-messages', {
        receiverId: item.id,
        options,
      });
      setMessage((_) => data.data.reverse().pop() || undefined);
    },
    [item],
  );

  useEffect(() => {
    getMessages();
    return () => {
      setMessage(undefined);
    };
  }, [item.id]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Room', roomInput);
      }}
    >
      <View style={styles.block}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <View style={theme.avatar}>
            <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/logo/user.png')}></Image>
          </View>
          <View>
            <Text style={styles.friendName}>{item.name}</Text>
            <Text style={{ flex: 1, color: color.darkGray }} numberOfLines={1}>
              {message?.content || ''}
            </Text>
          </View>
        </View>
        <View style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center' }}>
          {onlineFriendIds[item.id] ? (
            <View style={{ width: 8, height: 8, borderRadius: 8, backgroundColor: color.green }}></View>
          ) : undefined}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  block: {
    height: 60,
    backgroundColor: '#ffffff',
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default FriendItem;
