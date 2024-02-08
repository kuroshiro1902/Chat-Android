import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color } from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import Clipboard from '@react-native-clipboard/clipboard';
import AppChessboard from '../components/AppChessboard';

function Room() {
  const route = useRoute();
  const { roomId } = route.params as any;
  const [iconName, setIconName] = useState('copy');

  const copyToClipboard = () => {
    Clipboard.setString(roomId);
    setIconName('check');
    setTimeout(() => setIconName('copy'), 1500);
  };

  return (
    <View>
      <View style={styles.roomHeader}>
        <Text style={{ color: color.white }}>Room id: </Text>
        <Text style={styles.roomId}>{roomId}</Text>
        <Pressable onPress={copyToClipboard}>
          <View style={styles.copyIdBtn}>
            <Icon name={iconName} size={16} color="#FFF" />
          </View>
        </Pressable>
      </View>
      <AppChessboard isStarted={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 8,
    padding: 4,
    backgroundColor: color.blue,
  },
  roomId: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  copyIdBtn: {
    marginLeft: 8,
  },
});

export default Room;
