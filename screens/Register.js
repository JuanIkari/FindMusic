import * as React from "react";
import { Button, View, Text } from "react-native";

export default function Register({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text> REGISTRARSE </Text>
      <Button
        title="Iniciar sesion"
        onPress={() => navigation.navigate("Login")}
      />
      <Button title="registrarse" onPress={() => navigation.replace("Home")} />
    </View>
  );
}
