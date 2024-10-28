import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Button,
  TextInput,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import Entypo from "@expo/vector-icons/Entypo";

export default function Playlist() {
  const { token, user } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const createPlaylist = async () => {
    if (!playlistName) {
      Alert.alert(
        "Nombre Requerido",
        "Por favor, ingresa un nombre para la playlist."
      );
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/users/${user.id}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistName,
            description: playlistDescription,
            public: false, // Cambia a true si quieres que sea pública
          }),
        }
      );

      const data = await response.json();
      console.log("Playlist creada:", data.id);
      if (data.id) {
        setPlaylists((prevPlaylists) => [...prevPlaylists, data]);

        Alert.alert(
          "Playlist creada",
          "Tu nueva playlist se ha creado exitosamente."
        );
        setPlaylistName("");
        setPlaylistDescription("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error creando la playlist:", error);
      Alert.alert("Error", "No se pudo crear la playlist.");
    }
  };

  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.playlist_header}>
          <Text style={styles.playlistTitle}>Tus playlists</Text>

          <Pressable onPress={() => setModalVisible(true)}>
            <Entypo name="plus" size={32} color="white" />
          </Pressable>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Nueva Playlist</Text>

              <TextInput
                style={styles.input}
                placeholder="Nombre de la playlist"
                placeholderTextColor="#ccc"
                value={playlistName}
                onChangeText={setPlaylistName}
              />
              <TextInput
                style={styles.input}
                placeholder="Descripción de la playlist"
                placeholderTextColor="#ccc"
                value={playlistDescription}
                onChangeText={setPlaylistDescription}
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Cancelar"
                  onPress={() => setModalVisible(false)}
                  color="#f44"
                />
                <Button title="Crear" onPress={createPlaylist} />
              </View>
            </View>
          </View>
        </Modal>

        <FlatList
          data={playlists}
          renderItem={({ item }) => (
            <View style={styles.playlistItem}>
              <Image
                source={{ uri: item.images?.[0]?.url || "default_image_url" }}
                style={styles.playlistImage}
              />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.playlistName}>{item.name}</Text>
                <Text style={{ color: "white", fontSize: 12 }}>
                  {item.description}
                </Text>
              </View>
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
  playlist_header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "97%",
    marginBottom: 60,
  },
  playlistTitle: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#444",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
