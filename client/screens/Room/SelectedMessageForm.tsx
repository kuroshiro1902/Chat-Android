import { Platform, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { color, theme } from '../../theme';
import { IMessage } from '../../models/message.model';
import { Alert } from 'react-native';
import formatDate from '../../utils/formatDate.util';
import { IMenuItem } from '../../models/menu-item.model';
import { useMemo } from 'react';

const _infoMenuItem = (timestamp: number): IMenuItem => {
  return {
    label: 'Thông tin',
    command: (timestamp: number) => {
      Alert.alert('Thông tin', `Thời gian gửi: ${formatDate(new Date(timestamp))}`, [
        { text: 'OK', onPress: () => {} },
      ]);
    },
  };
};

function SelectedMessageForm({
  message,
  isSelfMessage,
  handleDeleteMessage,
}: {
  message: IMessage;
  isSelfMessage: boolean;
  handleDeleteMessage: (message: IMessage) => any;
}) {
  const options: IMenuItem[] = useMemo(() => {
    if (isSelfMessage) {
      return [
        {
          label: 'Xóa',
          style: { color: '#ff0000' },
          command: () => {
            if (Platform.OS === 'web') {
              if (window.confirm('Bạn có muốn xóa tin nhắn này không?')) {
                console.log('confirm delete message');
                console.log(handleDeleteMessage);

                handleDeleteMessage(message);
              }
            } else {
              Alert.alert('Xóa tin nhắn', `Bạn có muốn xóa tin nhắn này không?`, [
                { text: 'OK', onPress: () => handleDeleteMessage(message) },
                { text: 'Cancel', onPress: () => {} },
              ]);
            }
          },
        },
        { label: 'Sửa', command: () => {} },
        _infoMenuItem(message.sendTimestamp),
      ];
    } else {
      return [_infoMenuItem(message.sendTimestamp)];
    }
  }, [message, isSelfMessage]);
  return (
    <View style={styles.container} id="selected-message-form">
      {options.map((o, i) => (
        <TouchableOpacity key={i} style={styles.button} onPress={() => o.command?.(message.sendTimestamp)}>
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

export default SelectedMessageForm;
