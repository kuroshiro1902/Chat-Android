import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IMenuItem } from '../../models/menu-item.model';
import { useNavigation } from '@react-navigation/native';
import { color } from '../../theme';

interface props {
  userId: number;
}

function Menu({ userId }: props) {
  const navigation: any = useNavigation();
  const options: IMenuItem[] = useMemo(() => {
    return [
      {
        label: 'Xem trang cá nhân',
        command: () => {
          navigation.navigate('Info', { userId });
        },
      },
    ];
  }, [userId]);
  return (
    <View style={styles.container}>
      {options.map((o, i) => (
        <TouchableOpacity key={i} style={styles.button} onPress={o.command}>
          <Text style={{ ...styles.text, ...o.style }}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    minWidth: 300,
    shadowColor: '#000000',
    marginTop: 40,
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

export default Menu;
