import { useNavigation, useRoute } from '@react-navigation/native';
import { Alert, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { color } from '../../theme';
import BackGroundImage from '../../components/BackgroundImage';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UserContext } from '../../contexts/User';
import { IUser } from '../../models/user.model';
import Loading from '../../components/Loading';
import api from '../../api';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import { IFriendRequest } from '../../models/friend-request.model';
import FriendAcceptanceButton from '../../components/FriendAcceptanceButton';

function Info() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useRoute().params as { userId: number };
  const { user: self, friends } = useContext(UserContext);

  const [user, setUser] = useState<IUser | null>(null);
  const [friendRequest, setFriendRequest] = useState<IFriendRequest>();

  const isFriendWithUser = useMemo(() => {
    if (friends.findIndex((f) => f.id === userId) === -1) {
      return false;
    }
    return true;
  }, [userId, friends]);

  const handleAddFriend = useCallback(() => {
    setIsLoading(true);
    api
      .post<{ isSuccess: boolean; data?: IFriendRequest }>('/users/add-friend/' + userId)
      .then(({ data }) => {
        const { isSuccess, data: friendRequest } = data;
        if (isSuccess && friendRequest) {
          setFriendRequest(friendRequest);
        }
      })
      .catch((err) => {
        setFriendRequest(undefined);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userId]);

  const handleAddFriendPress = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Gửi lời mời kết bạn tới ${user?.name}?`)) {
        return handleAddFriend();
      }
    }
    if (Platform.OS === 'android') {
      Alert.alert('', `Gửi lời mời kết bạn tới ${user?.name}?`, [
        {
          text: 'Đồng ý',
          onPress: handleAddFriend,
        },
        {
          text: 'Hủy',
          onPress: () => {},
        },
      ]);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await api.get<{ isSuccess: boolean; data?: IUser }>('/users/id/' + userId);
        const { data: user, isSuccess } = data;
        if (!isSuccess || !user) {
          throw new Error('Not found');
        }
        setUser(user);
      } catch (error) {
        setUser({ id: 0, name: 'Not found' });
      }
    };
    const getFriendRequest = async () => {
      try {
        const { data } = await api.get<{ isSuccess: boolean; data?: IFriendRequest }>(
          '/users/friend-request/' + userId,
        );
        const { data: friendRequest, isSuccess } = data;
        if (!isSuccess) {
          throw new Error('Not found');
        }
        setFriendRequest(friendRequest);
      } catch (error) {
        setFriendRequest(undefined);
      }
    };

    getUser();
    getFriendRequest();
    return () => {
      setUser(null);
    };
  }, [userId]);

  if (!user) {
    return <Loading />;
  }

  return (
    <>
      <BackGroundImage />
      <View style={styles.container}>
        <View style={styles.header}>
          <View id="cover-image-ctn" style={styles.coverImgCtn}>
            <Image
              source={require('../../assets/userwallpaper.jpg')}
              style={{ width: '100%', resizeMode: 'cover', opacity: 0.8 }}
            />
          </View>
          <View style={styles.avatarImgCtn}>
            <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/logo/user.png')}></Image>
          </View>
          {isFriendWithUser ? (
            <>
              <View id="message-btn" style={{ ...styles.roundBtn, ...styles.message }}>
                <TouchableOpacity onPress={() => navigation.navigate('Room', { receiverId: userId, name: user.name })}>
                  <AntDesignIcon name="message1" size={24} color={color.white} />
                </TouchableOpacity>
              </View>
              <View id="delete-btn" style={{ ...styles.roundBtn, ...styles.delete }}>
                <TouchableOpacity>
                  <AntDesignIcon name="deleteuser" size={24} color={color.white} />
                </TouchableOpacity>
              </View>
            </>
          ) : friendRequest ? (
            <FriendAcceptanceButton item={{ ...friendRequest, senderName: user.name }} styles={styles.add} />
          ) : (
            // Nếu chưa ai gửi lời mời kết bạn cho người kia
            <View id="add-btn" style={{ ...styles.roundBtn, ...styles.add }}>
              <TouchableOpacity onPress={handleAddFriendPress}>
                <IonIcon name="person-add" size={24} color={color.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.main}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.quote}>{'Do something big!'}</Text>
          <Text style={styles.description}>
            {isFriendWithUser ? 'Các bạn đã là bạn bè của nhau.' : ''}
            {!isFriendWithUser && friendRequest?.type === 'request' ? 'Bạn đã gửi lời mời kết bạn cho người này.' : ''}
            {!isFriendWithUser && friendRequest?.type === 'acceptance'
              ? 'Người này đã gửi lời mời kết bạn cho bạn.'
              : ''}
            {!isFriendWithUser && !friendRequest ? 'Các bạn chưa phải là bạn bè, kết bạn ngay!' : ''}
          </Text>
        </View>
      </View>
    </>
  );
}

const coverImgHeight = 120;
const avatarImgHeight = 120;
const headerHeight = coverImgHeight + avatarImgHeight / 2;
const styles = StyleSheet.create({
  container: {},
  header: {
    height: headerHeight,
    position: 'relative',
  },
  coverImgCtn: {
    backgroundColor: color.green,
    height: coverImgHeight,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  avatarImgCtn: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    borderRadius: avatarImgHeight / 2,
    height: avatarImgHeight,
    width: avatarImgHeight,
    backgroundColor: '#fafafa',
    borderColor: color.white,
    borderWidth: 4,
  },
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
    position: 'absolute',
    bottom: coverImgHeight / 2 - 40 / 2,
    backgroundColor: color.blue,
    right: 20,
    borderWidth: 2,
  },
  message: {
    position: 'absolute',
    bottom: coverImgHeight / 2 - 40 / 2,
    backgroundColor: color.blue,
    right: 40 + 20 * 2 - 20 / 2,
    borderWidth: 2,
  },
  delete: {
    position: 'absolute',
    bottom: coverImgHeight / 2 - 40 / 2,
    backgroundColor: color.crimson,
    right: 20,
    borderWidth: 2,
  },
  main: {
    paddingHorizontal: 20,
    marginVertical: 8,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  name: {
    fontWeight: '700',
    fontSize: 18,
    color: color.darkGreen,
  },
  quote: {},
  description: {
    color: color.gray,
    fontStyle: 'italic',
  },
});

export default Info;
