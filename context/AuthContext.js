import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { useNavigation } from "@react-navigation/native";
import { CLIENT_ID, CLIENT_SECRET } from "@env";

// Crear el contexto
export const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  user: {
    id: "",
    name: "",
    profileImage: "",
    email: "",
  },
  promptAsync: () => {},
  logout: async () => {},
  getRecommendations: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({
    id: "",
    name: "",
    profileImage: "",
    email: "",
  });
  const navigation = useNavigation();

  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  // useAuthRequest para manejar el proceso de autenticación
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      scopes: [
        "ugc-image-upload", //imagenes
        "playlist-read-private", //leer playlist privadas
        "playlist-modify-private", //modificar playlist privadas
        "playlist-modify-public", //modificar playlist publicas
        "user-follow-modify", //!modificar seguidores
        "user-follow-read", //leer seguidores
        "user-top-read", //leer top (canciones y artistas) de usuario
        "user-library-modify", //modificar biblioteca
        "user-library-read", //leer biblioteca
        "user-read-email", //leer email
        "user-read-private", //leer información privada
      ],
      /* redirectUri: "exp://192.168.20.67:8081/" */ /* Diego */
      /* redirectUri: "exp://192.168.101.18:8081/" */ /* Ales */
      redirectUri: "exp://192.168.0.12:8081/",
    },
    discovery
  );

  // Manejar la respuesta de Spotify y almacenar el token
  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
      fetchUserProfile(access_token);
      storeData(access_token);
      navigation.navigate("Home");
    }
  }, [response]);

  const fetchUserProfile = async (access_token) => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const data = await res.json();
      setUser({
        id: data.id,
        name: data.display_name,
        profileImage: data.images?.[0]?.url || "default_profile_image_url",
        email: data.email,
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Guardar el token en AsyncStorage
  const storeData = async (token) => {
    try {
      await AsyncStorage.setItem("@access_token", token);
    } catch (e) {
      console.error("Error saving token:", e);
    }
  };

  // Cargar el token al iniciar la app
  const loadToken = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("@access_token");
      if (savedToken) setToken(savedToken);
    } catch (e) {
      console.error("Error loading token:", e);
    }
  };

  // Obtener recomendaciones
  const getRecommendations = async () => {
    console.log("Token:", token);
    if (!token) return [];
    try {
      const url =
        "https://api.spotify.com/v1/recommendations?limit=100&seed_genres=rock,punk";
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      return data.tracks;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@access_token");

      setToken(null);

      navigation.reset({
        index: 0,
        routes: [{ name: "Register" }],
      });

      console.log("Token eliminado y navegación reseteada.");
    } catch (e) {
      console.error("Error removing token:", e);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  const value = {
    token,
    isLoggedIn: !!token,
    user,
    promptAsync,
    logout,
    getRecommendations,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
