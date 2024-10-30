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
import Ionicons from "@expo/vector-icons/Ionicons";
import { appFirebase } from "../credenciales";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(appFirebase);

export default function Buscar() {
  const [lista, setLista] = React.useState([]);
  const [searchText, setSearchText] = React.useState(""); // Estado para la búsqueda

  const getLista = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "playlists"));
      const docs = [];
      querySnapshot.forEach((doc) => {
        const {
          user,
          userEmail,
          playlistName,
          playlistDescription,
          tracks = [{ trackName: "", artistName: "", albumImage: "" }],
        } = doc.data();
        docs.push({
          id: doc.id,
          user,
          userEmail,
          playlistName,
          playlistDescription,
          tracks,
        });
      });
      setLista(docs);
    } catch (error) {
      console.error("Error fetching playlist details:", error);
    }
  };

  // Llama a getLista en el montaje del componente
  React.useEffect(() => {
    getLista();
  }, []);

  // Filtra la lista en función del texto de búsqueda
  const filteredList = lista.filter((playlist) =>
    playlist.playlistName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Botón de actualización */}
        <TouchableOpacity style={styles.refreshButton} onPress={getLista}>
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.refreshButtonText}>Actualizar</Text>
        </TouchableOpacity>

        {/* Lista de playlists recomendadas */}
        <Text style={styles.playlistTitle}>Playlists Firebase</Text>
        <FlatList
          data={filteredList} // Usamos la lista filtrada
          renderItem={({ item }) => (
            <View style={styles.playlistItem}>
              <Image
                source={{
                  uri:
                    item.tracks?.[0]?.albumImage || "default_profile_image_url",
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
            </View>
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
            onChangeText={(text) => setSearchText(text)} // Actualizamos el texto de búsqueda
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
