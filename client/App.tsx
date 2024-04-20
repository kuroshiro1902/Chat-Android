import { NavigationContainer, useNavigation } from '@react-navigation/native';
import UserProvider from './contexts/User';
import Sidebar from './screens/Sidebar';
import SocketProvider from './contexts/Socket';
import { AppRegistry, Platform, View } from 'react-native';

// const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <ChatApp />
    </NavigationContainer>
  );
}

function ChatApp() {
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

// AppRegistry.registerComponent('main', () => App);

// if (Platform.OS === 'web') {
//   const rootTag = document.getElementById('root') || document.getElementById('X');
//   AppRegistry.runApplication('X', { rootTag });
// }
