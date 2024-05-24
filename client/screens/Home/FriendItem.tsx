import { useCallback, useContext, useEffect, useState } from 'react';
import { IRoomInput } from '../Room/models/room-input.model';
import { IMessage } from '../../models/message.model';
import api from '../../api';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, theme } from '../../theme';
import { UserContext } from '../../contexts/User';
import { useNavigation } from '@react-navigation/native';
import { IUser } from '../../models/user.model';
import { SocketHandler } from '../../contexts/Socket';
import { colorish } from '../../utils/colorish.util';
let renderCount = 0;

interface props {
  item: IUser;
}
const FriendItem = ({ item }: props) => {
  console.log('rerender friend item', renderCount++, 'time');

  const navigation: any = useNavigation();
  const { user, onlineFriendIds, isNotReadMessageOfFriendIds, setIsNotReadMessageOfFriendIds } =
    useContext(UserContext);
  const roomInput: IRoomInput = { receiverId: item.id, name: item.name };
  const [message, setMessage] = useState<IMessage | null>(null);

  const getMessages = useCallback(
    async (options?: any) => {
      const { data } = await api.post<{ data: IMessage[] }>('/messages/get-messages', {
        receiverId: item.id,
        options,
      });
      console.log({ data }); // GET TOO MUCH MESSAGES, need fix

      const newestMessage = data.data.reverse().pop() || null;
      setMessage((_) => newestMessage);
      console.log({ item, newestMessage });

      if (newestMessage) {
        if (newestMessage.senderId === item.id && !newestMessage.isRead) {
          setIsNotReadMessageOfFriendIds((prev) => ({ ...prev, [newestMessage.senderId]: true }));
        }
      }
    },
    [item?.id],
  );

  useEffect(() => {
    SocketHandler.newestMessage = (message) => {
      setMessage(message);
    };
    getMessages({ pageIndex: 1, perPage: 1, sortBy: 'sendTimestamp', order: 'desc' });
    return () => {
      setMessage(null);
    };
  }, [item?.id]);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Room', roomInput);
      }}
    >
      <View style={styles.block}>
        <View style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: 8 }}>
          <View style={theme.avatar} id={`avatar-${item.id}`}>
            <Image style={{ width: 44, height: 44 }} source={require('../../assets/logo/user.png')}></Image>
            {onlineFriendIds[item.id] ? <View style={theme.online}></View> : undefined}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.friendName}>{item.name}</Text>
            <View style={{ display: 'flex', flexDirection: 'row', gap: 12, marginTop: 6 }}>
              <Text
                style={{
                  flex: 1,
                  color: message && isNotReadMessageOfFriendIds[message?.senderId] ? color.darkGreen : color.darkGray,
                  fontWeight: message && isNotReadMessageOfFriendIds[message?.senderId] ? '700' : '400',
                }}
                numberOfLines={1}
              >
                {message?.content || ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center' }}>
          {message && isNotReadMessageOfFriendIds[message?.senderId] ? (
            <Text
              style={{
                backgroundColor: color.crimson,
                borderRadius: 8,
                paddingHorizontal: 4,
                fontSize: 12,
                color: '#ffffff',
              }}
            >
              N
            </Text>
          ) : undefined}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  block: {
    height: 68,
    backgroundColor: colorish(color.white),
    padding: 8,
    gap: 8,
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
