import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import Feed from "./Feed";
import Buscar from "./Buscar";
import Perfil from "./Perfil";
import Playlist from "./Playlist";

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Feed") {
            iconName = "home-outline";
          } else if (route.name === "Buscar") {
            iconName = "search-outline";
          } else if (route.name === "Perfil") {
            iconName = "person-outline";
          } else if (route.name === "Playlist") {
            iconName = "musical-notes-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Feed" component={Feed} options={{headerShown: false}}/>
      <Tab.Screen name="Buscar" component={Buscar} options={{headerShown: false}}/>
      <Tab.Screen name="Perfil" component={Perfil} options={{headerShown: false}}/>
      <Tab.Screen name="Playlist" component={Playlist} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}
