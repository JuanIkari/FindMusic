import * as React from "react";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export default function Register({ navigation }) {
  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  // useAuthRequest debe estar fuera de la función `login`
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "a6110594729042a5aaf6afabe2bb6fb1",
      clientSecret: "0d7485e7e88e4393a6cf5b7da7f2e67c",
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      redirectUri: "exp://192.168.0.12:8081/", // tu URI de redirección correcta
    },
    discovery
  );

  // Efecto para manejar la respuesta
  React.useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      console.log(access_token); // Aquí se obtiene el token de acceso
      storeDaata(access_token);
    }
  }, [response]);

  const storeDaata = async (token) => {
    try {
      await AsyncStorage.setItem("@access_token", token);
    } catch (e) {
      // saving error
      console.log("Error", e);
    }
  };

  return (
    //fondo
    <LinearGradient
      colors={["#0C0322", "#190633"]}
      style={{ flex: 1, paddingTop: 30, paddingBottom: 100 }}
    >
      {/* imagen */}
      <ImageBackground
        source={require("../assets/chart.png")}
        style={{ flex: 1, marginTop: 10 }}
        resizeMode="cover"
      >
        {/* logo */}
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

        {/* degradado img  */}
        <LinearGradient
          colors={["transparent", "#190633"]}
          style={styles.gradient}
        ></LinearGradient>

        {/* botones */}
        <View style={styles.button_container}>
          <Pressable
            style={styles.spotify_button}
            onPress={() => promptAsync()} // Aquí llamas a promptAsync
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
  logoContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
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
  spotify_text: {
    color: "black",
    fontWeight: "500",
    textAlign: "center",
    flex: 1,
  },
  button: {
    backgroundColor: "190633",
    top: 50,
    width: 300,
    padding: 10,
    borderRadius: 30,
    borderColor: "white",
    borderWidth: 1,
    marginVertical: 10,
    alignItems: "center",
    zIndex: 1,
  },
});
