import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { appFirebase } from "../credenciales";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDocto,
  query,
  where,
} from "firebase/firestore";

import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const db = getFirestore(appFirebase);

export default function PlaylistDetails({ route }) {
  const navigation = useNavigation();
  const { playlistId } = route.params;
  const { token, user, tokenbd } = useContext(AuthContext);
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setPlaylist(data);
        setTracks(data.tracks.items); // Obtener canciones de la playlist
      } catch (error) {
        console.error("Error fetching playlist details:", error);
      }
    };

    fetchPlaylistDetails();
  }, [playlistId, token]);

  const publishPlaylist = async () => {
    try {
      // Crear el objeto con la información que quieres guardar
      const playlistData = {
        userEmail: user.email, // Agregar el correo del usuario
        playlistName: playlist.name,
        playlistDescription: playlist.description || "Sin descripción",
        tracks: tracks.map((item) => ({
          trackName: item.track.name,
          artistName: item.track.artists[0].name,
          albumImage: item.track.album.images[0].url,
        })),
      };

      // Agregar a Firestore
      await addDoc(collection(db, "playlists"), playlistData);

      Alert.alert(
        "Playlist publicada",
        "La playlist se ha publicado correctamente"
      );
    } catch (error) {
      console.error("Error al publicar la playlist:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al publicar la playlist. Inténtalo de nuevo."
      );
    }
  };

  const deletePlaylist = async () => {
    try {
      // Buscar la playlist en Firestore basada en el nombre y correo del usuario
      const q = query(
        collection(db, "playlists"),
        where("playlistName", "==", playlist.name),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(doc(db, "playlists", docId));

        Alert.alert(
          "Playlist eliminada",
          "La playlist se ha eliminado correctamente"
        );
      } else {
        Alert.alert("Error", "No se encontró la playlist para eliminar");
      }
    } catch (error) {
      console.error("Error al eliminar la playlist:", error);
      Alert.alert("Error", "Hubo un problema al eliminar la playlist.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons_container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={publishPlaylist}>
          <MaterialIcons name="publish" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={deletePlaylist}>
          <MaterialIcons name="delete" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {playlist && (
        <>
          <View style={styles.playlist_info}>
            <Image
              source={{ uri: playlist.images[0].url }}
              style={styles.playlist_image}
            />
            <View style={styles.playlist_text}>
              <Text style={styles.playlist_title}>{playlist.name}</Text>
              <Text style={styles.playlist_description}>
                {playlist.description}
              </Text>
            </View>
          </View>

          <FlatList
            data={tracks}
            keyExtractor={(item) => item.track.id}
            renderItem={({ item }) => (
              <View style={styles.track_item}>
                <Image
                  source={{ uri: item.track.album.images[0].url }}
                  style={styles.track_image}
                />
                <View>
                  <Text style={styles.track_name}>{item.track.name}</Text>
                  <Text style={styles.track_artist}>
                    {item.track.artists[0].name}
                  </Text>
                </View>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: "#0C0322",
  },
  buttons_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  playlist_info: {
    flexDirection: "row",
    alignItems: "center",
  },
  playlist_text: {
    flex: 1,
    flexDirection: "column",
    margin: 20,
  },
  playlist_image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginVertical: 20,
  },
  playlist_title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  playlist_description: {
    fontSize: 14,
    color: "#ccc",
  },
  track_item: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  track_image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  track_name: {
    fontSize: 16,
    color: "#fff",
  },
  track_artist: {
    fontSize: 14,
    color: "#ccc",
  },
});