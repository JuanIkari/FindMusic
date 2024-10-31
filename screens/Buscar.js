import * as React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { appFirebase } from "../credenciales";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function Buscar() {
  const [lista, setLista] = React.useState([]);
  const [searchText, setSearchText] = React.useState(""); // Estado para la búsqueda
  const navigation = useNavigation();

  // Función para obtener playlists
  const getPlaylists = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "playlists"));
      const docs = [];
      querySnapshot.forEach((doc) => {
        const {
          user,
          userEmail,
          playlistName,
          playlistDescription,
          playlistImage,
          tracks = [{ trackName: "", artistName: "", albumImage: "" }],
        } = doc.data();
        docs.push({
          id: doc.id,
          user,
          userEmail,
          playlistName,
          playlistDescription,
          playlistImage,
          tracks,
        });
      });
      setLista(docs);
    } catch (error) {
      console.error("Error fetching playlist details:", error);
    }
  };

  // Función para buscar playlists según el texto de búsqueda
  const searchPlaylists = async (queryText) => {
    if (!queryText) {
      getPlaylists(); // Si no hay texto, obtiene todas las playlists
      return;
    }

    try {
      const q = query(
        collection(db, "playlists"),
        where("playlistName", ">=", queryText),
        where("playlistName", "<=", queryText + "\uf8ff") // Para incluir resultados que comienzan con el query
      );

      const querySnapshot = await getDocs(q);
      const docs = [];
      querySnapshot.forEach((doc) => {
        const {
          user,
          userEmail,
          playlistName,
          playlistDescription,
          playlistImage,
          tracks,
        } = doc.data();
        docs.push({
          id: doc.id,
          user,
          userEmail,
          playlistName,
          playlistDescription,
          playlistImage,
          tracks,
        });
      });
      setLista(docs);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  // Llama a getPlaylists en el montaje del componente
  React.useEffect(() => {
    getPlaylists();
  }, []);

  // Llama a searchPlaylists cada vez que cambia el texto de búsqueda
  React.useEffect(() => {
    searchPlaylists(searchText);
  }, [searchText]);

  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Botón de actualización */}
        <TouchableOpacity style={styles.refreshButton} onPress={getPlaylists}>
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.refreshButtonText}>Actualizar</Text>
        </TouchableOpacity>

        {/* Lista de playlists */}
        <Text style={styles.playlistTitle}>Playlists y Resultados</Text>
        <FlatList
          data={lista} // Usamos la lista de playlists
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.playlistItem}
              onPress={() =>
                navigation.navigate("PlaylistDetails", {
                  playlistId: item.id,
                })
              }
            >
              <Image
                source={{
                  uri: item.playlistImage || "default_profile_image_url",
                }}
                style={styles.playlistImage}
              />
              <View>
                <Text style={styles.playlistName}>{item.playlistName}</Text>
                {item.playlistDescription ? (
                  <Text style={styles.playlistDescription}>
                    {item.playlistDescription}
                  </Text>
                ) : null}
                <Text style={styles.playlistUser}>Por: {item.user}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
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
            style={{ fontSize: 16, color: "#fff" }}
            value={searchText}
            onChangeText={setSearchText} // Actualizamos el texto de búsqueda
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
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#2E1B4B",
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
    fontWeight: "bold",
  },
  playlistDescription: {
    fontSize: 14,
    color: "#ccc",
  },
  playlistUser: {
    fontSize: 12,
    color: "#aaa",
  },
  searchBarContainer: {
    position: "absolute",
    bottom: 130,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E0F47",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#1E0F47",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 20,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});
