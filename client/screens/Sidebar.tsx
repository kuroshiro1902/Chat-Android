import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./Login";
import Home from "./Home/Home";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/User";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Room from "./Room/Room";
import { RawButton } from "react-native-gesture-handler";
import { getUser, removeToken, removeUser } from "../api";
import { IUser } from "../models/user.model";

const Drawer = createDrawerNavigator();

function Sidebar({navigation}: any) {
  const {setUser} = useContext(UserContext)
  return ( 
    <Drawer.Navigator initialRouteName="Login" backBehavior='firstRoute'>
      <Drawer.Screen name="Home" component={Home} options={{drawerLabel: 'Trang chủ', headerStyle: {height: 36}, title: ''}}>
      </Drawer.Screen>
      <Drawer.Screen name="Login" component={Login} options={{headerShown: false, drawerItemStyle: { display: 'none' }}} />
      <Drawer.Screen name="Logout" options={{headerShown: false, drawerLabel: 'Đăng xuất' }}>
        {() => {
          const logout = async () => {
            await removeToken();
            await removeUser();
            setUser(_=>null);
          }
          return <Login navigation={navigation} logout={logout} />
        }}
      </Drawer.Screen>
      <Drawer.Screen name="Room" options={{
        headerShown: false,
        unmountOnBlur: true,
        drawerItemStyle: { display: 'none' }}}>
        {() => <Room navigation={navigation} />}
      </Drawer.Screen>
    </Drawer.Navigator>
   );
}

export default Sidebar;