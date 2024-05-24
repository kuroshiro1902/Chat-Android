import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { color } from '../theme';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IFriendRequest } from '../models/friend-request.model';
import { UserContext } from '../contexts/User';
import api from '../api';
import { IUser } from '../models/user.model';
import { IMenuItem } from '../models/menu-item.model';
import Overlay from './Overlay';
import { SocketContext } from '../contexts/Socket';

interface props {
  styles?: ViewStyle;
  item: IFriendRequest;
}

function FriendAcceptanceButton({ styles, item }: props) {
  const [isLoading, setIsLoading] = useState(false);
  // const [isShowForm, setIsShowForm] = useState(false);
  // const [options, setOptions] = useState<IMenuItem[]>([]);
  const { friends, refetchFriends, refetchFriendAcceptances } = useContext(UserContext);
  const { client } = useContext(SocketContext);
  const handleAcceptFriendRequest = useCallback(() => {
    if (item.type === 'acceptance') {
      const acceptFriendRequest = async () => {
        setIsLoading(true);
        api
          .post<{ data?: IUser }>('/users/accept/' + item.id)
          .then(({ data }) => {
            if (data.data) {
              // refetchFriends();
              refetchFriendAcceptances();
              client?.emit('accept-friend-request', item);
              const message = 'Đã chấp nhận lời mời kết bạn của ' + data.data.name;
              window.alert(message);
              Alert.alert('Thành công!', message, [
                {
                  text: 'OK',
                },
              ]);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };
      const _message = 'Đồng ý lời mời kết bạn của ' + item.senderName + '?';
      if (Platform.OS === 'web') {
        if (window.confirm(_message)) {
          return acceptFriendRequest();
        }
      }
      if (Platform.OS === 'android') {
        Alert.alert('', _message, [
          {
            text: 'Đồng ý',
            onPress: acceptFriendRequest,
          },
          { text: 'Hủy' },
        ]);
      }
    }
    return;
  }, [friends.length, friends, item]);

  const handleRejectFriendRequest = useCallback(() => {
    console.log('từ chối kết bạn');
  }, [friends.length, friends, item]);

  const handleDeleteFriendRequest = useCallback(() => {}, [friends.length, friends, item]);

  // useEffect(() => {
  //   if (item.type === 'acceptance') {
  //     setOptions([
  //       {
  //         label: 'Đồng ý',
  //         style: { color: color.blue },
  //         command: handleAcceptFriendRequest,
  //       },
  //       {
  //         label: 'Từ chối',
  //         style: { color: color.orange },
  //         command: handleRejectFriendRequest,
  //       },
  //     ]);
  //   }
  //   if (item.type === 'request') {
  //     setOptions([
  //       {
  //         label: 'Xóa lời mời kết bạn',
  //         style: { color: color.orange },
  //         command: handleDeleteFriendRequest,
  //       },
  //     ]);
  //   }
  // }, [item]);

  const handlePress = useCallback(() => {}, [item]);

  return (
    <>
      {/* {isShowForm ? (
        <Overlay isShowCloseBtn={false} handleClose={() => setIsLoading(false)}>
          <View style={_styles.containerForm} id="selected-message-form">
            {options.map((o, i) => (
              <TouchableOpacity key={i} style={_styles.button} onPress={o.command}>
                <Text style={{ ..._styles.text, ...o.style }}>
                  {o.icon} {o.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Overlay>
      ) : undefined} */}
      <View id="add-btn" style={{ ..._styles.roundBtn, ..._styles.add, ...styles }}>
        <TouchableOpacity disabled={isLoading} onPress={handleAcceptFriendRequest}>
          <FontAwesome6Icon name="user-check" size={20} color={color.white} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const _styles = StyleSheet.create({
  roundBtn: {
    borderRadius: 40 / 2,
    height: 40,
    width: 40,
    backgroundColor: '#fafafa',
    borderColor: color.white,
    borderWidth: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  add: {
    // position: 'absolute',
    backgroundColor: color.blue,
    // right: 20,
    borderWidth: 2,
  },
  containerForm: {
    // position: 'absolute',
    minWidth: 300,
    shadowColor: '#000000',
    marginTop: 300,
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

export default FriendAcceptanceButton;
