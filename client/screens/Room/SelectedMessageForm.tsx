import { Platform, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { View } from 'react-native';
import { color, theme } from '../../theme';
import { IMessage } from '../../models/message.model';
import { Alert } from 'react-native';
import formatDate from '../../utils/formatDate.util';
import { IMenuItem } from '../../models/menu-item.model';
import { useMemo } from 'react';

const _infoMenuItem = (initTimestamp: number): IMenuItem => {
  return {
    label: 'Thông tin',
    icon: <FeatherIcon name="info" size={16} />,
    command: (timestamp: number) => {
      if (Platform.OS === 'web') {
        window.alert(`THÔNG TIN: \nThời gian gửi: ${formatDate(new Date((timestamp ?? initTimestamp) * 1000))}`);
      } else {
        Alert.alert('Thông tin', `Thời gian gửi: ${formatDate(new Date((timestamp ?? initTimestamp) * 1000))}`, [
          { text: 'OK', onPress: () => {} },
        ]);
      }
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
          icon: <AntDesignIcon name="delete" size={16} />,
          style: { color: '#ff0000' },
          command: () => {
            if (Platform.OS === 'web') {
              if (window.confirm('Bạn có muốn xóa tin nhắn này không?')) {
                console.log('confirm delete message');
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
        {
          label: 'Sửa',
          icon: <FeatherIcon name="edit-2" size={16} />,
          command: () => {},
        },
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
          <Text style={{ ...styles.text, ...o.style }}>
            {o.icon} {o.label}
          </Text>
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
