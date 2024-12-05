import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { useNavigation } from "@react-navigation/native";
import { ID2, SECRET2 } from "@env";
import { loginAuth, register } from "../utils/auth";
import recommendations from "../utils/JSON/canciones.json";

// Crear el contexto
export const AuthContext = createContext({
  token: "",
  tokenbd: "",
  isLoggedIn: false,
  /* user: {
    id: "",
    name: "",
    profileImage: "",
    email: "",
    followers: 0,
    artistIds: [],
    genres: [],
  }, */
  user: {
    id: "",
    name: "",
    profileImage: "",
    email: "",
    followers: 0,
  },
  login: async () => {},
  promptAsync: () => {},
  logout: async () => {},
  getRecommendations: async () => {},
  getUserPlaylists: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [tokenBD, setTokenbd] = useState(null);
  /* const [user, setUser] = useState({
    id: "",
    name: "",
    profileImage: "",
    email: "",
    followers: 0,
    artistIds: [],
    genres: [],
    product: "",
  }); */
  const [user, setUser] = useState({
    id: "",
    name: "",
    profileImage: "",
    email: "",
    followers: 0,
    product: "",
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
      clientId: ID2,
      clientSecret: SECRET2,
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
      //redirectUri: "exp://192.168.20.67:8081/"  /* Diego */
      redirectUri: "exp://192.168.101.18:8081/" /* Ales */
      //redirectUri: "exp://192.168.0.12:8081/",
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

  /* const fetchUserProfile = async (access_token) => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const response = await fetch(
        "https://api.spotify.com/v1/me/top/artists?limit=20",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      const data = await res.json();
      const data2 = await response.json();

      const genres = data2.items.flatMap((artist) => artist.genres);
      const artistIds = data2.items.map((artist) => artist.id);

      setUser({
        id: data.id,
        name: data.display_name,
        profileImage: data.images?.[0]?.url || "default_profile_image_url",
        email: data.email,
        followers: data.followers.total,
        artistIds: artistIds,
        genres: [...new Set(genres)],
        product: data.product,
      });

      storeUserData({
        id: data.id,
        name: data.display_name,
        profileImage: data.images?.[0]?.url || "default_profile_image_url",
        email: data.email,
        followers: data.followers.total,
      });
      login(data.email, data.id);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }; */
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
        product: data.product,
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
  }

  /* const getRecommendations = async () => {
    if (!token) return [];

    const uniqueGenres = user.genres.map((genre) => genre.replace(/\s+/g, "+"));
    const numGenres = Math.floor(Math.random() * 5) + 1;
    const selectedGenres = uniqueGenres
      .sort(() => 0.5 - Math.random())
      .slice(0, numGenres);

    const useGenres = Math.random() < 0.5;
    let recommendationsUrl;

    if (useGenres) {
      const seedGenres = selectedGenres.join(",");
      recommendationsUrl = `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${seedGenres}`;
    } else {
      // Seleccionar al azar numGenres artistas del array de 30 artistas
      const selectedArtists = user.artistIds
        .sort(() => 0.5 - Math.random())
        .slice(0, 1);

      const seedArtists = selectedArtists.join(",");
      recommendationsUrl = `https://api.spotify.com/v1/recommendations?limit=10&seed_artists=${seedArtists}`;
    }

    // Fetch de recomendaciones
    try {
      const response = await fetch(recommendationsUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        console.warn(
          `Rate limit reached. Retrying after ${retryAfter} seconds.`
        );
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        return getRecommendations(); // Retry after delay
      }
      const recommendationsData = await response.json();
      console.log("tokenbd", user.tokenbd);
      return recommendationsData.tracks;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  }; */

  const getRecommendations = async () => {
    if (!token) return [];

    try {
      return recommendations.tracks;
    } catch (error) {
      console.error("Error fetching recommendations from JSON:", error);
      return [];
    }
  };

  // playlists
  const getUserPlaylists = async (token) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener las playlists del usuario");
      }

      const data = await response.json();
      console.log("Playlists data: ", data);

      // Filtrar playlists en las que el usuario autenticado es el dueño
      const userPlaylists = data.items.filter(
        (playlist) => playlist.owner.id === user.id
      );

      return userPlaylists; // Devuelve solo las playlists del usuario
    } catch (error) {
      console.error("Error fetching user playlists:", error);
      return [];
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

  const storeUserData = async (userData) => {
    try {
      await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
    } catch (e) {
      console.error("Error guardando la data del usuario:", e);
    }
  };

  const loadUserData = async () => {
    try {
      const savedUserData = await AsyncStorage.getItem("@user_data");
      if (savedUserData) {
        setUser(JSON.parse(savedUserData));
        login(user.email, user.id);
      }
    } catch (e) {
      console.error("Error loading user data:", e);
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
          login(user.email, user.id);
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

  // Función para hacer login
  async function login(email, password) {
    if (!tokenBD) {
      try {
        const tokenBD = await register(email, password);
        setTokenbd(tokenBD);
        console.log("register TokenBD: ", tokenBD);
      } catch (e) {
        console.log("Error al hacer login:", e);
      }
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@access_token");
      setToken(null);
      setTokenbd(null);

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
    tokenbd: tokenBD,
    isLoggedIn: !!token,
    user,
    login,
    promptAsync,
    logout,
    getRecommendations,
    getUserPlaylists,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
