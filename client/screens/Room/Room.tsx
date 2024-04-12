import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, theme } from '../../theme';
import FeatherIcon from 'react-native-vector-icons/AntDesign';
import Clipboard from '@react-native-clipboard/clipboard';
import WhiteText from '../../components/WhiteText';
import { styles } from './styles';
import { UserContext } from '../../contexts/User';
import { IUser } from '../../models/user.model';
import { IRoomInput } from './models/room-input.model';
import { TouchableOpacity } from 'react-native';
import { IMessage } from '../../models/message.model';

interface IBottomMenuOpt {
  message: string;
  handler: (...args: any[]) => void;
}

function TextMove({children, isBlack}: {children: string, isBlack?: boolean}){
  return (
    <Text style={{color: isBlack ? '#333' : '#ddd', marginRight: 6, fontSize: 18}}>{children}</Text>
  )
}

const test: any[] = [];
for(let i = 0; i < 20; i++){test.push(<TextMove key={i}>{'h'+i}</TextMove>)}

function Room({navigation}: any) {
  const {user} = useContext(UserContext);
  const {name} = useRoute().params as IRoomInput;
  const [messages, setMessages] = useState<IMessage[]>([]);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{paddingHorizontal: 12, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}
          onPress={()=>{navigation.navigate('Home')}}
        >
          <FeatherIcon name='arrowleft' size={20} color={'#ffffff'} />
        </TouchableOpacity>
        <View style={theme.avatar}></View>
        <Text style={styles.roomName}>{name}</Text>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={messages}
          renderItem={({ item }) => {
            // const roomInput: IRoomInput = {receiverId: item.id, name: item.name};
            return (
            <TouchableOpacity onPress={() => {}}>
              {/* <View style={styles.block}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                  <View style={theme.avatar}></View>
                </View>
                <View style={{ display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 8, backgroundColor: color.green }}></View>
                </View>
              </View> */}
              <View><Text>TEXTS</Text></View>
            </TouchableOpacity>)
          }}
          keyExtractor={(_, i) => `${i}`}
          style={styles.messageListCtn}
        />
      </View>
    </View>
  );
}

export default Room;
