import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { color } from '../../theme';
import WhiteText from '../../components/WhiteText';
import { useCallback, useState } from 'react';
import Loading from '../../components/Loading';

function Search({ navigation }: any) {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = useCallback((searchValue: string) => {
    console.log(searchValue);
  }, []);
  return (
    <>
      {isLoading && <Loading />}
      <View style={styles.container} id="Search-container">
        <Text style={{ marginBottom: 4 }}>Tìm kiếm những người bạn quen biết.</Text>
        <View style={styles.searchForm}>
          <TextInput
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
          <TouchableOpacity style={styles.submitBtn}>
            <WhiteText>Search</WhiteText>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  searchForm: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
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
    outlineStyle: 'none',
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
});

export default Search;
