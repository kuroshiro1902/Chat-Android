import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./Login";
import Home from "./Home";
import { useContext } from "react";
import { UserContext } from "../contexts/User";

const Drawer = createDrawerNavigator();

function Sidebar() {
  const {user} = useContext(UserContext);
  return ( 
    <Drawer.Navigator initialRouteName="Login">
        {!user && <Drawer.Screen name="Login" component={Login} options={{headerShown: false}} />}
        {user && <>
          <Drawer.Screen name="Home" component={Home} />
        </>}
      </Drawer.Navigator>
   );
}

export default Sidebar;