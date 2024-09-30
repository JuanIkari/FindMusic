import * as React from "react";
import { View, Text, StyleSheet, Pressable, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'expo-image';
import Entypo from '@expo/vector-icons/Entypo';

export default function Register({ navigation }) {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1, paddingTop: 30, paddingBottom: 100 }}>
      {/* imagen */}
      <ImageBackground
        source={{ uri: 'https://cdn.discordapp.com/attachments/1281332888473702457/1290145136285847562/chart.png?ex=66fb64ca&is=66fa134a&hm=2ffea3fa56aa62a868a85c0d556ea73333626884dd02f9a7b47be43bb984d904&' }}
        style={{ flex: 1, marginTop: 15 }}
        resizeMode="cover"
      >
        {/* logo */}
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", zIndex: 1, top: 0 }}>
          <Image
            source={'https://i.ibb.co/0V0J1pK/1727370200014.png'}
            style={{ width: 200, height: 220 }}
          />
        </View>

        <LinearGradient colors={["transparent", "#190633"]} style={styles.gradient}
        ></LinearGradient>
        {/* botones */}
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
      </ImageBackground>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 1100,
  },
  button_container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  spotify_button: {
    backgroundColor: "#1ED760",
    top: 50,
    width: 300,
    padding: 10,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 1
  },
  spotify_text: {
    color: "black",
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
  },
  button: {
    backgroundColor: '190633',
    top: 50,
    width: 300,
    padding: 10,
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 1,
    marginVertical: 10,
    alignItems: 'center',
    zIndex: 1
  },
});