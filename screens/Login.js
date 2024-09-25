import * as React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Login</Text>
      </View>
    </LinearGradient>
  );
}
