import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";

export default function Playlist() {
  const { playlists } = useContext(AuthContext);

  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.playlistTitle}>Tus playlists</Text>

        {/* Lista de playlists */}
        <FlatList
          data={playlists}
          renderItem={({ item }) => (
            <View style={styles.playlistItem}>
              {/* Imagen y nombre de la playlist */}
              <Image
                source={{ uri: item.images[0]?.url }}
                style={styles.playlistImage}
              />
              <Text style={styles.playlistName}>{item.name}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
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
