import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as NavigationBar from "expo-navigation-bar";
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Importamos safeAreaInsets

import Feed from "./Feed";
import Buscar from "./Buscar";
import Perfil from "./Perfil";
import Playlist from "./Playlist";

const Tab = createBottomTabNavigator();
NavigationBar.setPositionAsync("absolute");
NavigationBar.setBackgroundColorAsync("#ffffff01");

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: '#00000099',
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          elevation: 0,
          height: 65 + insets.bottom,
          paddingBottom: 5 + insets.bottom,
          paddingTop: 10,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Playlist") {
            return <MaterialCommunityIcons name="playlist-music-outline" size={size} color={color} />;
          } else {
            const icons = {
              Feed: "musical-notes-outline",
              Buscar: "search-outline",
              Perfil: "person-outline",
            };

            return <Icon name={icons[route.name]} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "purple",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
      <Tab.Screen name="Buscar" component={Buscar} options={{ headerShown: false }} />
      <Tab.Screen name="Playlist" component={Playlist} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}