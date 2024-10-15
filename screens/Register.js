import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Entypo from "@expo/vector-icons/Entypo";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { promptAsync } = useContext(AuthContext);

  return (
    <LinearGradient
      colors={["#0C0322", "#190633"]}
      style={{ flex: 1, paddingTop: 30, paddingBottom: 100 }}
    >
      <ImageBackground
        source={require("../assets/chart.png")}
        style={{ flex: 1, marginTop: 10 }}
        resizeMode="cover"
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            top: 0,
          }}
        >
          <Image
            source={"https://i.ibb.co/0V0J1pK/1727370200014.png"}
            style={{ width: 200, height: 240 }}
          />
        </View>

        <LinearGradient
          colors={["transparent", "#190633"]}
          style={styles.gradient}
        ></LinearGradient>

        <View style={styles.button_container}>
          <Pressable
            style={styles.spotify_button}
            onPress={() => promptAsync()} // Llamar al contexto
          >
            <Entypo name="spotify" size={24} color="black" />
            <Text
              style={{
                color: "black",
                fontWeight: 500,
                textAlign: "center",
                flex: 1,
              }}
            >
              Iniciar sesión con Spotify
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 1200,
  },
  button_container: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  spotify_button: {
    backgroundColor: "#1ED760",
    top: 50,
    width: 300,
    padding: 10,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    zIndex: 1,
  },
});
