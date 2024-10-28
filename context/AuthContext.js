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
    followers: 0,
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
    followers: 0,
  });
  const [cachedGenres, setCachedGenres] = useState([]);
  const [cachedArtistIds, setCachedArtistIds] = useState([]);
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
        "ugc-image-upload",
        "playlist-read-private",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-follow-modify",
        "user-follow-read",
        "user-top-read",
        "user-library-modify",
        "user-library-read",
        "user-read-email",
        "user-read-private",
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
      fetchTopArtists(access_token);
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
        followers: data.followers.total,
      });

      storeUserData({
        id: data.id,
        name: data.display_name,
        profileImage: data.images?.[0]?.url || "default_profile_image_url",
        email: data.email,
        followers: data.followers.total,
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
      if (savedToken) {
        setToken(savedToken);
        // Verificar si el token es válido
        const isValid = await checkTokenValidity(savedToken);
        if (isValid) {
          await loadUserData();
          navigation.navigate("Home"); // Redirigir a Home si el token es válido
        } else {
          await AsyncStorage.removeItem("@access_token");
          setToken(null); // Limpiar el estado del token si no es válido
          navigation.navigate("Register"); // Redirigir a Register si el token no es válido
        }
      } else {
        navigation.navigate("Register"); // Redirigir a Register si no hay token guardado
      }
    } catch (e) {
      console.error("Error loading token:", e);
      navigation.navigate("Register"); // Redirigir a Register en caso de error
    }
  };

  // Función para verificar la validez del token
  const checkTokenValidity = async (token) => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok; // Retorna true si el token es válido
    } catch (error) {
      console.error("Error checking token validity:", error);
      return false; // En caso de error, asumimos que no es válido
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
