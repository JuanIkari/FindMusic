import * as React from "react";
import { Button, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Register({ navigation }) {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text> REGISTRARSE </Text>
        <Button
          title="Iniciar sesion"
          onPress={() => navigation.navigate("Login")}
        />
        <Button title="registrarse" onPress={() => navigation.replace("Home")} />
      </View>
    </LinearGradient>
  );
}
