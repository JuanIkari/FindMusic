import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'expo-image';
import Entypo from '@expo/vector-icons/Entypo';

export default function Register({ navigation }) {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          source={'https://i.ibb.co/0V0J1pK/1727370200014.png'}
          style={{ width: 200, height: 200 }}
        />
      </View>
      <View style={styles.button_container}>
        <Pressable
          style={styles.spotify_button}
          onPress={() => navigation.navigate("Login")}
        >
          <Entypo name="spotify" size={24} color="black" />
          <Text style={{ color: "black", fontWeight: 500, textAlign: "center", flex: 1 }}>Iniciar sesión con Spotify</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.replace("Home")}
        >
          <Text style={{ color: "white", fontWeight: 500 }}>Registrarse</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  button_container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  spotify_button: {
    backgroundColor: "#1ED760",
    width: 300,
    padding: 10,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: "transparent",
    width: 300,
    padding: 10,
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 1,
    marginVertical: 10,
    alignItems: 'center',
  },
});