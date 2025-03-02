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
import CreatePackage from "./CreatePackage";
import MyCartons from "./MyCartons";
import MyProfile from "./MyProfile";

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return <FontAwesome name="home" size={24} color={color} />;
          }
          // if (route.name === "Create Package") {
          //   return <Feather name="package" size={24} color={color} />;
          // }
          if (route.name === "My Cartons") {
            return (
              <MaterialCommunityIcons name="truck" size={24} color={color} />
            );
          }
          if (route.name === "Profile") {
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
      {/* <Tab.Screen
        name="Create Package"
        component={CreatePackage}
        options={{ headerShown: false }}
      /> */}
      <Tab.Screen
        name="My Cartons"
        component={MyCartons}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={MyProfile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default TabLayout;
