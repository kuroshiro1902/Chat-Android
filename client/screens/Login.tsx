import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color, theme } from "../theme";
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../environments";
import { UserContext } from "../contexts/User";
import { IUser } from "../models/user.model";
import Loading from "../components/Loading";

const path = (mode: 'login' | 'signup') =>`/auth/${mode}`;
function Login({navigation}: any) {
  const {user, setUser, token, setToken} = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const toggleMode = () => setMode(prev => prev === 'login' ? 'signup' : 'login');

  const getUser = useCallback(async () => {
    try {
      const localUser = await AsyncStorage.getItem('user');
      const localToken = await AsyncStorage.getItem('token');
      if (localUser && localToken) {
        // setUsername(JSON.parse(localUser).username)
        //
        const _user = JSON.parse(localUser);
        const _token = JSON.parse(localToken);
        console.log(_user, _token);
        handleSuccess(_user, _token);
      }
    }
    catch (error) {
      // setIsLoading(_=>false);
    }
    finally {
      setIsLoading(_=>false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  const submit = () => {
    setIsLoading(_ => true);
    axios.post(server.url + path(mode), {username, password, name})
    .then(async (res: any)=>{
      const {user, token} = res.data.data;
      setError(_=>'');
      handleSuccess(user, token);
    })
    .catch((error) => {
      setError(error.response?.data?.message ?? 'Error! Try again later.');
      setIsLoading(_ => false);
    })
  }

  const handleSuccess = (user: IUser, token: string) => {
    setTimeout(async ()=>{
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', JSON.stringify(token));
      setUser(_=>user);
      setToken(_=>token);
      navigation.navigate('Home');
      setIsLoading(_ => false);
    }, 0)
    // navigation.replace('Home');
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