import { NavigationContainer, useNavigation } from '@react-navigation/native';
import UserProvider from './contexts/User';
import Sidebar from './screens/Sidebar';
import SocketProvider from './contexts/Socket';

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
      <SocketProvider>
        <Sidebar navigation={navigation} />
      </SocketProvider>
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

// AppRegistry.registerComponent('android-client', () => App);

// if (Platform.OS === 'web') {
//   const rootTag = document.getElementById('root') || document.getElementById('X');
//   AppRegistry.runApplication('X', { rootTag });
// }