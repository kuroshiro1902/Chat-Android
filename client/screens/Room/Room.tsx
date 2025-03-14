import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Button, FlatList, Image, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { color, theme } from '../../theme';
import FeatherIcon from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
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
import SelectedMessageForm from './SelectedMessageForm';
import Overlay from '../../components/Overlay';
import Menu from './Menu';
import { IPagination } from '../../models/pagination.model';
import BackGroundImage from '../../components/BackgroundImage';
import ImageUpload from '../../components/ImageUpload';
import { adjustDimension } from '../../utils/adjustDimension.util';

const pageSize = 20;

function Room({ navigation }: any) {
  const { user, setIsNotReadMessageOfFriendIds } = useContext(UserContext);
  const { client } = useContext(SocketContext);
  const params = useRoute().params as IRoomInput;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInputValue, setMessageInputValue] = useState('');
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<IMessage | null>(null);
  const messageListCtnRef = useRef<any>();

  // page Metadata
  const [pageIndex, setPageIndex] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // image
  const [showImageForm, setShowImageForm] = useState(false);

  const { receiverId, name } = params;

  const updateToReadMessages = useCallback(async (senderId: number) => {
    api.update<{ data?: IMessage[] }>(`messages/read-messages/${senderId}`).then(({ data }) => {
      const message = data.data?.[0];
      if (message) {
        setIsNotReadMessageOfFriendIds((prev) => ({ ...prev, [message.senderId]: false }));
      }
    });
  }, []);

  const handleSendMessage = useCallback(() => {
    setMessageInputValue((prev) => {
      const content = prev?.trim();
      if (!!!content) return prev;
      client?.emit('message', { senderId: user?.id, receiverId, content } as IMessage);
      return '';
    });
  }, [receiverId, user?.id]);

  const handleSendImage = useCallback(
    (content: string) => {
      client?.emit('message', { senderId: user?.id, receiverId, content } as IMessage);
    },
    [receiverId, user?.id],
  );

  const handleDeleteMessage = useCallback(async (message: IMessage) => {
    client?.emit('delete-message', message);
    setSelectedMessage(null);
  }, []);

  const handleDeleteAllMessages = useCallback(async () => {
    api.delete<{ data?: IMessage[] }>(`messages/all/${receiverId}`).then(({ data }) => {
      client?.emit('delete-all-messages', { selfId: user?.id, friendId: receiverId });
    });
  }, [receiverId]);

  const getMessages = useCallback(async () => {
    try {
      const body: { receiverId: number; options: IPagination } = {
        receiverId,
        options: { pageIndex },
      };
      const res = await api.post<{ data: IMessage[] }>('/messages/get-messages', body);
      const { data } = res.data;
      if (data.length === 0) {
        setHasNextPage(false);
      }
      setPageIndex((prev) => prev + 1);
      return data.reverse();
    } catch (error: any) {
      console.log('Error getting messages:', error?.message);
      return [];
    }
  }, [receiverId, pageIndex]);

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore((_) => true);
    const additionMessages = await getMessages();
    setMessages((prev) => [...additionMessages, ...prev]);
    return setIsLoadingMore((_) => false);
  }, [receiverId, pageIndex]);

  useEffect(() => {
    SocketHandler.receiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        messageListCtnRef.current.scrollToEnd({ animated: true });
        console.log(receiverId, message);

        if (message.senderId === receiverId) {
          updateToReadMessages(message.senderId);
        }
      }, 200);
    };

    SocketHandler.deleteMessage = (messageId: number) => {
      console.log('delete message id:', messageId);
      if (messageId) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    };

    return () => {
      SocketHandler.receiveMessage = (message) => {
        setIsNotReadMessageOfFriendIds((prev) => ({ ...prev, [message.senderId]: true }));
      };
      SocketHandler.deleteMessage = () => {};
    };
  }, [receiverId]);

  useEffect(() => {
    setIsLoading(true);
    getMessages()
      .then((messages) => {
        setMessages(messages);
      })
      .finally(() => {
        setTimeout(() => {
          messageListCtnRef.current?.scrollToEnd({ animated: true });
          setIsLoading(false);
        }, 200);
      });
    updateToReadMessages(receiverId);

    return () => {
      setMessages([]);
    };
  }, [receiverId]);

  return (
    <>
      {isLoading ? <Loading /> : undefined}
      {selectedMessage ? (
        <Overlay isShowCloseBtn={false} handleClose={() => setSelectedMessage(null)}>
          <SelectedMessageForm
            message={selectedMessage}
            isSelfMessage={selectedMessage.senderId === user?.id}
            handleDeleteMessage={handleDeleteMessage}
          />
        </Overlay>
      ) : undefined}
      {isShowMenu ? (
        <Overlay handleClose={() => setIsShowMenu(false)}>
          <Menu userId={receiverId} handleDeleteAllMessages={handleDeleteAllMessages} />
        </Overlay>
      ) : undefined}
      <View style={styles.container}>
        <BackGroundImage />
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
              <Text>
                <FeatherIcon name="arrowleft" size={20} color={'#ffffff'} />
              </Text>
            </TouchableOpacity>
            <View style={theme.avatar}>
              <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/logo/user.png')}></Image>
            </View>
            <TouchableOpacity
              style={{ ...theme.avatar, flexDirection: 'row' }}
              onPress={() => {
                navigation.navigate('Info', { userId: receiverId });
              }}
            >
              <Image style={{ width: 44, height: 44 }} source={require('../../assets/logo/user.png')}></Image>
              <Text style={styles.roomName}>{name}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            id="room-menu"
            style={styles.headerMain}
            onPress={() => {
              setIsShowMenu(true);
            }}
          >
            <Text>
              <SimpleLineIcons name="options-vertical" size={20} color={'#ffffff'} />
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            ref={messageListCtnRef}
            data={[{}, ...messages] as IMessage[]}
            renderItem={({ item, index }) => {
              if (index === 0) {
                if (messages.length < 20) {
                  return <></>;
                }
                return (
                  <View
                    style={{
                      paddingHorizontal: 16,
                      marginVertical: 12,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    {isLoadingMore ? (
                      <Image style={{ height: 32, width: 32 }} source={require('../../assets/loading.gif')}></Image>
                    ) : (
                      <Button
                        disabled={!hasNextPage}
                        color={color.blue}
                        title="Xem thêm"
                        onPress={(e) => {
                          handleLoadMore();
                        }}
                      />
                    )}
                  </View>
                );
              }

              const _styles =
                item.receiverId === receiverId
                  ? { message: styles.selfMessage, ctn: styles.selfMessageCtn, color: '#ffffff' }
                  : { message: styles.otherMessage, ctn: styles.otherMessageCtn, color: '#000000' };

              const messageType = item.content.includes('res.cloudinary.com') ? 'image' : 'text';
              let iContent: any = item.content;
              if (messageType === 'image') {
                const { width, height, content } = JSON.parse(item.content);
                iContent = { width, height, content };
              }
              return (
                <View style={_styles.ctn}>
                  <TouchableHighlight
                    underlayColor={color.orange}
                    style={_styles.message}
                    onLongPress={() => setSelectedMessage(item)}
                    delayLongPress={150}
                  >
                    <View>
                      {messageType === 'image' ? (
                        <Image
                          style={adjustDimension({ width: iContent.width, height: iContent.height })}
                          source={{ uri: iContent.content }}
                        />
                      ) : (
                        <Text style={{ color: _styles.color, fontSize: 20 }}>{item.content}</Text>
                      )}
                    </View>
                  </TouchableHighlight>
                </View>
              );
            }}
            keyExtractor={(_, i) => `${i}`}
            style={styles.messageListCtn}
          />
        </View>
        {/* <View style={{ display: 'flex', flexDirection: 'row' }}>
          
        </View> */}
        {showImageForm ? (
          <Overlay
            isShowCloseBtn={true}
            handleClose={() => {
              setShowImageForm(false);
            }}
          >
            <ImageUpload
              urlHandler={handleSendImage}
              onClose={() => {
                setShowImageForm(false);
              }}
            />
          </Overlay>
        ) : undefined}
        <View id="message-form" style={styles.messageForm}>
          <TouchableOpacity style={styles.uploadImageBtn} onPress={() => setShowImageForm(true)}>
            <Text style={{ color: color.blue }}>
              <IonIcons name="image" size={24} />
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.messageInput}
            maxLength={255}
            multiline
            placeholder="Soạn tin nhắn"
            value={messageInputValue}
            onChangeText={(text) => {
              setMessageInputValue(text);
            }}
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
