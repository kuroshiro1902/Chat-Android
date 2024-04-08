import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color, theme } from "../theme";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../environments";
import Loading from "../components/Loading";
import api, { getToken, setToken, setUser } from "../api";
import { IResponse } from "../models/response.model";
import { IUser } from "../models/user.model";

const path = (mode: 'login' | 'signup') =>`/auth/${mode}`;
function Login({navigation}: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const toggleMode = () => setMode(prev => prev === 'login' ? 'signup' : 'login');

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await getToken();        
        if (!!token) {
          const {data} = await api.post<IResponse<any>>('auth/verify-token');
          if(data.isSuccess){
            const { token, user } = data.data;
            await handleSuccess(user, token);
          }
          else {
            setError(_=>data.message??'Error!');
          }
        }
      }
      catch (error) {
      }
      finally {
        setIsLoading(_=>false);
      }
    };

    getUser();
  }, []);

  const submit = () => {
    setIsLoading(_ => true);
    api.post(server.url + path(mode), {username, password, name})
    .then(async (res: any)=>{
      setError(_=>'');
      const { token, user } = res.data.data;
      await handleSuccess(user, token);
    })
    .catch((error) => {
      setError(error.response?.data?.message ?? 'Error! Try again later.');
    })
    .finally(() => {  
      setIsLoading(_ => false);
    })
  }

  const handleSuccess = async (user: IUser, token: string) => {
    await setToken(token);
    await setUser(user);
    setTimeout(async ()=>{
      navigation.navigate('Home');
    }, 0)
  }

  return ( 
    <>
    {isLoading && <Loading/>}
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logo/logo.png')}></Image>
      <Text style={styles.title}>{mode === 'login' ? 'Đăng nhập' : 'Đăng kí'}</Text>
      {mode === 'signup' && 
      <TextInput
        style={theme.input}
        value={name}
        onChangeText={setName}
        placeholder="Tên người chơi"
      />
      }
      <TextInput
        style={theme.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Tên đăng nhập"
      />
      <TextInput
        style={theme.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        onKeyPress={(e: any)=>{
          if (e.keyCode === 13) {
            submit();
          }
        }}
        secureTextEntry={true}
      />
      <Text style={{color: color.red}}>{error}</Text>
      <View style={{marginTop: 18}}>
        {isLoading &&
          <Pressable
            disabled
            style={{...theme.button, backgroundColor: color.darkGreen, paddingHorizontal: 18}}
          >
            <Text style={{color: 'inherit', fontSize: 28}}>Submit</Text>
          </Pressable>
        }
        {!isLoading &&
          <Pressable
            style={{...theme.button, paddingHorizontal: 18}}
            onPress={submit}
            >
            <Text style={{color: 'inherit', fontSize: 28}}>Submit</Text>
          </Pressable>
        }
      </View>
      <View style={styles.textBottom}>
        <Text>{mode === 'login' ? 'Chưa': 'Đã'} có tài khoản?</Text>
        <Pressable onPress={toggleMode}>
          <Text style={styles.changeMode}>{mode === 'login' ? 'Đăng kí' : 'Đăng nhập'} ngay!</Text>
        </Pressable>
      </View>
    </View>
    </>
   );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 24
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: color.darkGreen,
    marginBottom: 16
  },
  logo: {
    margin: 'auto'
  },
  textBottom: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    marginTop: 20
  },
  changeMode: {
    textDecorationLine: 'underline',
    color: color.blue
  }
});


export default Login;