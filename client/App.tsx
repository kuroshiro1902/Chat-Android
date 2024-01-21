import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import UserProvider from './contexts/User';
import Sidebar from './screens/Sidebar';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Sidebar />
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
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
