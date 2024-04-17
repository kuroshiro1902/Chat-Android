import { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { UserContext } from '../../contexts/User';
import { color, theme } from '../../theme';
import Loading from '../../components/Loading';
import { IUser } from '../../models/user.model';
import api from '../../api';
import FriendItem from './FriendItem';

function Home({ navigation }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, onlineFriendIds, setUser } = useContext(UserContext);
  const [friends, setFriends] = useState<IUser[]>([]);

  useEffect(() => {
    if (!user) {
      return navigation.navigate('Login');
    }
    console.log('get friends');
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
      {isLoading && <Loading />}
      <View>
        <Text style={styles.title}>
          Xin chào, <Text style={styles.name}>{user?.name}</Text>
        </Text>
        <Text style={{ paddingLeft: 4, marginBottom: -8 }}>Bạn bè</Text>
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
  text: {
    color: 'inherit',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default Home;
