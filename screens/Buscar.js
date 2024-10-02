import * as React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

const playlistsRecomendadas = [
  {
    id: 1,
    name: "Love$ick",
    image:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c3c70523ed65d3372299f7d72",
  },
  {
    id: 2,
    name: "Top 50 Global",
    image:
      "https://charts-images.scdn.co/assets/locale_en/regional/daily/region_global_default.jpg",
  },
  {
    id: 3,
    name: "Frutiger aero",
    image:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c554072ba8c5c8f4ac8463be8",
  },
  {
    id: 4,
    name: "Brainrot",
    image:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cb24fb8d4060156509dfb56b8",
  },
  {
    id: 5,
    name: "HOT Playlist 🔥",
    image:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84d98141322ae596545d31dc54",
  },
  {
    id: 6,
    name: "Paranoia",
    image:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cda8b8a7cd99e4c999a627035",
  },
];

export default function Buscar() {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Lista de playlists recomendadas */}
        <Text style={styles.playlistTitle}>Playlists Recomendadas</Text>
        <FlatList
          data={playlistsRecomendadas}
          renderItem={({ item }) => (
            <View style={styles.playlistItem}>
              <Image
                source={{ uri: item.image }}
                style={styles.playlistImage}
              />
              <Text style={styles.playlistName}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          style={{ flex: 1, width: "100%" }}
        />

        {/* Barra de búsqueda */}
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search"
            size={24}
            color="white"
            style={{ marginRight: 10 }}
          />
          <TextInput
            placeholder="Buscar playlists..."
            placeholderTextColor="#888"
            style={{ fontSize: 16 }}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  playlistTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 40,
  },
  playlistItem: {
    flexDirection: "row", // Alinea imagen y texto horizontalmente
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  playlistImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  playlistName: {
    fontSize: 16,
    color: "#fff",
  },
  searchBarContainer: {
    position: "absolute",
    bottom: 130, // Espacio para separarla del BottomTabNavigator
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E0F47",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
