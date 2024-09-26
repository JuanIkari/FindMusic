import * as React from "react";
import { Button, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'expo-image';

export default function Register({ navigation }) {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image 
          source={'https://i.ibb.co/0V0J1pK/1727370200014.png'}
          style={{ width: 200, height: 200 }}
        />
        <Button
          title="Iniciar sesion"
          onPress={() => navigation.navigate("Login")}
        />
        <Button title="registrarse" onPress={() => navigation.replace("Home")} />
      </View>
    </LinearGradient>
  );
}
