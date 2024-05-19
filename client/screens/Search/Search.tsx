import { FlatList, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { color } from '../../theme';
import WhiteText from '../../components/WhiteText';
import { useCallback, useState } from 'react';
import Loading from '../../components/Loading';
import api from '../../api';
import { IUser } from '../../models/user.model';
import FriendSearchItem from './FriendSearchItem';
import BackGroundImage from '../../components/BackgroundImage';

function Search({ navigation }: any) {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IUser[]>([]);
  const [message, setMessage] = useState('');
  const handleSearch = useCallback(async (searchValue: string) => {
    setIsLoading((_) => true);
    const search = searchValue?.trim() ?? '';
    if (!!!search) {
      setIsLoading((_) => false);
      setMessage('Hãy nhập tên bạn bè để tìm kiếm.');
      return setResults([]);
    }
    try {
      const { data } = await api.get<{ isSuccess: boolean; data?: IUser[] }>('/users/search', { search });
      const { isSuccess, data: users } = data;

      if (!isSuccess || !users || users.length === 0) {
        setMessage('Không tìm thấy bạn bè.');
        return setResults([]);
      }
      setMessage('');
      return setResults(users);
    } catch (error) {
      console.log(error);
      setMessage('Không tìm thấy bạn bè.');
      setResults([]);
    } finally {
      setIsLoading((_) => false);
    }
  }, []);
  return (
    <>
      {isLoading ? <Loading /> : undefined}
      <BackGroundImage />
      <View style={styles.container} id="Search-container">
        <Text style={{ paddingBottom: 4, marginBottom: 4 }}>
          <FontAwesome5 name="user-friends" style={{ marginRight: 4 }} />
          Tìm kiếm những người bạn quen biết.
        </Text>
        <View style={styles.searchForm}>
          <TextInput
            maxLength={30}
            value={searchValue}
            onChangeText={setSearchValue}
            onKeyPress={(e) => {
              // @ts-ignore
              if (e.keyCode === 13) {
                handleSearch(searchValue);
              }
            }}
            placeholder="Tìm kiếm"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => handleSearch(searchValue)} style={styles.submitBtn}>
            <WhiteText>Search</WhiteText>
          </TouchableOpacity>
        </View>
        <View>
          <Text>{message}</Text>
        </View>
        <View>
          <FlatList
            data={results}
            renderItem={({ item }) => {
              return <FriendSearchItem item={item} />;
            }}
            style={styles.resultList}
            keyExtractor={(_, i) => `${i}`}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: 'relative',
  },
  searchForm: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: 8,
    borderColor: color.blue,
    borderWidth: 1,
    fontSize: 18,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: '#ffffff',
    // @ts-ignore
    // outlineStyle: 'none',
  },
  submitBtn: {
    maxWidth: 60,
    padding: 4,
    height: '100%',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: color.blue,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultList: {
    height: '100%',
    paddingHorizontal: 4,
  },
});

export default Search;
