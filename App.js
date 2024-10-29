import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";

import Register from "./screens/Register";
import Home from "./screens/Home";
import PlaylistDetails from "./screens/PlaylistDetails";
import { AuthProvider } from "./context/AuthContext";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator
          initialRouteName="Register"
          screenOptions={{ headerTransparent: true, headerTintColor: "#fff" }}
        >
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PlaylistDetails"
            component={PlaylistDetails}
            options={{ headerShown: false }}
         /> 
        </Stack.Navigator>
        <StatusBar style="light" />
      </AuthProvider>
    </NavigationContainer>
  );
}
