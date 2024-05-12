import { useRoute } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import { color } from '../../theme';
import BackGroundImage from '../../components/BackgroundImage';
import { useContext, useEffect, useMemo, useState } from 'react';
import { UserContext } from '../../contexts/User';
import { IUser } from '../../models/user.model';
import Loading from '../../components/Loading';
import api from '../../api';

function Info({ navigation }: any) {
  const { userId } = useRoute().params as { userId: number };
  const { user: self, friends } = useContext(UserContext);

  const [user, setUser] = useState<IUser | null>(null);

  const isFriendWithUser = useMemo(() => {
    if (friends.findIndex((f) => f.id === userId) === -1) {
      return false;
    }
    return true;
  }, [userId, friends]);

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
    getUser();
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
          <View style={styles.coverImgCtn}></View>
          <View style={styles.avatarImgCtn}>
            <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/logo/user.png')}></Image>
          </View>
        </View>
        <View style={styles.main}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.quote}>{'Do something big!'}</Text>
          <Text style={styles.description}>
            {isFriendWithUser ? 'Các bạn đã là bạn bè của nhau.' : 'Chưa phải là bạn bè, kết bạn ngay!'}
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
