import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { color, theme } from '../../theme';
import FeatherIcon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import WhiteText from '../../components/WhiteText';
import { styles } from './styles';
import { UserContext } from '../../contexts/User';
import { IUser } from '../../models/user.model';
import { IRoomInput } from './models/room-input.model';
import { TouchableOpacity } from 'react-native';
import { IMessage } from '../../models/message.model';
import api from '../../api';
import Loading from '../../components/Loading';
import { SocketContext, SocketHandler } from '../../contexts/Socket';
import { IResponse } from '../../models/response.model';

function Room({ navigation }: any) {
  const { user } = useContext(UserContext);
  const { client } = useContext(SocketContext);
  const params = useRoute().params as IRoomInput;
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const messageInputRef = useRef<any>();
  const messageListCtnRef = useRef<any>();

  useEffect(() => {
    SocketHandler.receiveMessage = (res: IResponse<IMessage>) => {
      if (res.data) {
        setMessages((prev) => [...prev, res.data!]);
        setTimeout(() => {
          messageListCtnRef.current.scrollToEnd({ animated: true });
        }, 200);
      }
    };
    return () => {
      delete SocketHandler.receiveMessage;
    };
  }, []);

  const { receiverId, name } = params;

  const handleSendMessage = useCallback(() => {
    const content = messageInputRef.current.value.trim();
    if (!!!content) return;
    messageInputRef.current.value = '';

    client?.emit('message', { senderId: user?.id, receiverId, content } as IMessage);
  }, [user, client, messageInputRef, params]);

  useEffect(() => {
    const getMessages = async () => {
      setIsLoading(true);
      const { data } = await api.post<{ data: IMessage[] }>('/messages/get-messages', { receiverId });
      setMessages((_) => data.data.reverse());
    };
    getMessages().finally(() => {
      setIsLoading(false);
      setTimeout(() => {
        messageListCtnRef.current.scrollToEnd({ animated: true });
      }, 200);
    });

    return () => {
      setMessages([]);
    };
  }, [receiverId]);

  return (
    <>
      {' '}
      {isLoading && <Loading />}
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
              onPress={() => {
                navigation.navigate('Home');
              }}
            >
              <FeatherIcon name="arrowleft" size={20} color={'#ffffff'} />
            </TouchableOpacity>
            <View style={theme.avatar}>
              <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/logo/user.png')}></Image>
            </View>
            <Text style={styles.roomName}>{name}</Text>
          </View>
          <TouchableOpacity style={styles.headerMain}>
            <SimpleLineIcons name="options-vertical" size={20} color={'#ffffff'} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            ref={messageListCtnRef}
            data={messages}
            renderItem={({ item }) => {
              const _styles =
                item.receiverId === receiverId
                  ? { message: styles.selfMessage, ctn: styles.selfMessageCtn, color: '#ffffff' }
                  : { message: styles.otherMessage, ctn: styles.otherMessageCtn, color: '#000000' };
              return (
                <View style={_styles.ctn}>
                  <Pressable style={_styles.message}>
                    <View>
                      <Text style={{ color: _styles.color, fontSize: 20 }}>{item.content}</Text>
                    </View>
                  </Pressable>
                </View>
              );
            }}
            keyExtractor={(_, i) => `${i}`}
            style={styles.messageListCtn}
          />
        </View>
        <View id="message-form" style={styles.messageForm}>
          <TextInput
            style={styles.messageInput}
            maxLength={255}
            multiline
            placeholder="Gửi tin nhắn"
            ref={messageInputRef}
          />
          <TouchableOpacity style={styles.messageSubmitBtn} onPress={handleSendMessage}>
            <Text style={{ color: color.white, fontSize: 18, textAlign: 'center', flex: 1 }}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export default Room;
