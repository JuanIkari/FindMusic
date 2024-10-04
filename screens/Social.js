import * as React from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const playlists = [
  {
    id: 1,
    name: "This Is City Pop",
    image:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da848168c88069169a25be9a9734",
  },
  {
    id: 2,
    name: "R-M-P",
    image:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c424f972112b24029c7c6c975",
  },
  {
    id: 3,
    name: "house",
    image:
      "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c800577317f575b3dd9b46b4a",
  },
  {
    id: 4,
    name: "Classic Punk",
    image: "https://i.scdn.co/image/ab67706f00000002a0fe39d8cece8e5ef70e4410",
  },
];

// Pantalla de configuraciones simple
export default function Social() {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.playlistTitle}>Amixes</Text>

        {/* Lista de playlists */}
        <FlatList
          data={playlists}
          renderItem={({ item }) => (
            <View style={styles.playlistItem}>
              {/* Imagen y nombre de la playlist */}
              <Image
                source={{ uri: item.image }}
                style={styles.playlistImage}
              />
              <Text style={styles.playlistName}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          style={{ width: "100%" }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  playlistTitle: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 60,
  },
  playlistItem: {
    flexDirection: "row",
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
});
