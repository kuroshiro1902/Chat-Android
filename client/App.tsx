import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import UserProvider from './contexts/User';
import Sidebar from './screens/Sidebar';
import GameProvider from './contexts/Game';

// const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Game />
    </NavigationContainer>
  );
}

function Game() {
  const navigation = useNavigation();
  return (
    <UserProvider>
      <GameProvider navigation={navigation}>
        <Sidebar navigation={navigation} />
        {/* <Stack.Navigator>
          <Stack.Screen
          name='Login'
          component={Login}
          options={{headerShown: false}}
          >
          </Stack.Screen>
          <Stack.Screen
          name='Home'
          component={Home}
          options={{ title: 'Chess - PTIT Android' }}
          >
          </Stack.Screen>
        </Stack.Navigator> */}
      </GameProvider>
    </UserProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
