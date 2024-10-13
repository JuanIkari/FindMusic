import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { useNavigation } from "@react-navigation/native";

// Crear el contexto
export const AuthContext = createContext({
  token: "",
  isLoggedInd: false,
  user: {
    id: "", // Añadimos el campo id para almacenar el Spotify ID
    name: "",
    profileImage: "",
  },
  promptAsync: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({ id: "", name: "", profileImage: "" });
  const [playlists, setPlaylists] = useState(null);
  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  const navigator = useNavigation();

  // useAuthRequest para manejar el proceso de autenticación
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
      redirectUri: "exp://192.168.101.18:8081/", /* Ales */
      /* redirectUri: "exp://192.168.0.12:8081/" */ /* Juanpa */
    },
    discovery
  );

  // Manejar la respuesta de Spotify y almacenar el token
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);

      // Obtener los datos del usuario, incluyendo su Spotify ID
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser({
            id: data.id, // Aquí almacenamos el Spotify ID
            name: data.display_name,
            profileImage: data.images?.[0]?.url || "default_profile_image_url",
          });
        });

      storeData(access_token);
      navigator.navigate("Home");
    }
  }, [response]);

  // Guardar el token en AsyncStorage
  const storeData = async (token) => {
    try {
      await AsyncStorage.setItem("@access_token", token);
    } catch (e) {
      console.log("Error", e);
    }
  };

  // Cargar el token al iniciar la app
  const loadToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("@access_token");
      if (savedToken) {
        setToken(savedToken);
      }
    } catch (e) {
      console.log("Error loading token", e);
    }
  };

  // Definir la función de logout correctamente
  const logout = async () => {
    setToken(null);
    try {
      await AsyncStorage.removeItem("@access_token");
      navigator.reset({
        routes: [{ name: "Register" }],
      });
    } catch (e) {
      console.log("Error removing token", e);
    }
  };

  // Llamar a la función al montar el componente
  useEffect(() => {
    loadToken();
    console.log("playist", playlists);
  }, []);

  const value = {
    token: token,
    isLoggedInd: !!token,
    user: user, // Aquí se incluirá el Spotify ID
    promptAsync: promptAsync,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
