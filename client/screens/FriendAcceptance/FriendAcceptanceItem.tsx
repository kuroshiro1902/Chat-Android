import { useCallback, useContext, useEffect, useState } from 'react';
import { IRoomInput } from '../Room/models/room-input.model';
import { IMessage } from '../../models/message.model';
import api from '../../api';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { color, theme } from '../../theme';
import { UserContext } from '../../contexts/User';
import { useNavigation } from '@react-navigation/native';
import { SocketHandler } from '../../contexts/Socket';
import { colorish } from '../../utils/colorish.util';
import { IFriendRequest } from '../../models/friend-request.model';
import FriendAcceptanceButton from '../../components/FriendAcceptanceButton';
import formatDate from '../../utils/formatDate.util';
import Overlay from '../../components/Overlay';

interface props {
  item: IFriendRequest;
}
const FriendAcceptanceItem = ({ item }: props) => {
  const navigation: any = useNavigation();

  const getMessages = useCallback(
    async (options?: any) => {
      const { data } = await api.post<{ data: IMessage[] }>('/messages/get-messages', {
        receiverId: item.id,
        options,
      });
    },
    [item?.id],
  );

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Info', { userId: item.senderId });
        }}
      >
        <View style={styles.block}>
          <View style={{ display: 'flex', flex: 1, flexDirection: 'row', gap: 8 }}>
            <View style={theme.avatar} id={`avatar-${item.id}`}>
              <Image style={{ width: 44, height: 44 }} source={require('../../assets/logo/user.png')}></Image>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.friendName}>{item.senderName}</Text>
              <Text
                style={{
                  fontSize: 12,
                  color: color.darkGreen,
                }}
              >
                {formatDate(new Date(item.sendTimestamp * 1000))}
              </Text>
              <View style={{ display: 'flex', flexDirection: 'row', gap: 12, marginTop: 6 }}>
                <Text
                  style={{
                    flex: 1,
                    color: color.darkGreen,
                  }}
                  numberOfLines={1}
                >
                  {item?.content || ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center' }}>
            <FriendAcceptanceButton item={item} />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  block: {
    height: 80,
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

export default FriendAcceptanceItem;
