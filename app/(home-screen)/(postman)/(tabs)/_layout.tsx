import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Home from "./Home";
import ListOfConsignment from "./ListOfConsignment";
import MyProfile from "./MyProfile";
import { Stack } from "expo-router";
import Scan from "../(services)/Scan";
import Deliver from "../(services)/Deliver";
const Tab = createBottomTabNavigator();

export const StackLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="Scan"
        component={Scan}
        options={{ headerShown: false }} // Hide header for Scan screen
      />
      <Stack.Screen
        name="Deliver"
        component={Deliver}
        options={{ headerShown: false }} // Hide header for Deliver screen
      />
    </Stack>
  );
};

const TabLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return <FontAwesome name="home" size={24} color={color} />;
          }
          if (route.name === "ListOfConsignment") {
            return <Feather name="package" size={24} color={color} />;
          }

          if (route.name === "MyProfile") {
            return <Ionicons name="person-circle" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#CD3431",
        tabBarInactiveTintColor: "black",
        tabBarStyle: {
          backgroundColor: "#f5f5f5",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />

      <Tab.Screen
        name="ListOfConsignment"
        component={ListOfConsignment}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
