import { useContext, useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native';
import { UserContext } from '../../contexts/User';
import { color, theme } from '../../theme';
import Loading from '../../components/Loading';
import { IUser } from '../../models/user.model';
import api from '../../api';
import FriendItem from './FriendItem';
import BackGroundImage from '../../components/BackgroundImage';
import { TouchableOpacity } from 'react-native-gesture-handler';

function Home({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, friends, setFriends, setIsNotReadMessageOfFriendIds } = useContext(UserContext);

  useEffect(() => {
    setIsNotReadMessageOfFriendIds((prev) => {
      return friends.reduce((prev, friend) => ({ ...prev, [friend.id]: false }), {});
    });
  }, [friends]);

  useEffect(() => {
    if (!user) {
      return navigation.navigate('Login');
    }
    api
      .get<{ data?: IUser[] }>('/users/friends')
      .then(({ data }) => {
        if (data.data) {
          setFriends(data.data);
        } else {
          setFriends([]);
        }
      })
      .catch(() => {
        setFriends([]);
      });
  }, [user]);

  return (
    <>
      <StatusBar hidden />
      {isLoading ? <Loading /> : undefined}
      <BackGroundImage />
      <View style={{ position: 'relative' }}>
        <View style={styles.title}>
          <View style={styles.avatarCtn}>
            <Image style={{ width: 36, height: 36 }} source={require('../../assets/logo/user.png')}></Image>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Self');
            }}
          >
            <Text style={styles.name}>{user?.name}</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ paddingLeft: 4, marginBottom: -8 }}>Bạn bè ({friends?.length})</Text>
        <FlatList
          data={friends}
          renderItem={({ item }) => <FriendItem item={item} />}
          keyExtractor={(_, i) => `${i}`}
          style={styles.mainCtn}
        />
      </View>
    </>
  );
}

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
    padding: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatarCtn: {
    height: 40,
    width: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: color.orange,
  },
  name: {
    fontSize: 18,
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

export default Home;
