import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import Login from './screens/Login';
import Home from './screens/Home';
import UserProvider from './contexts/User';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator>
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
        </Stack.Navigator>
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
