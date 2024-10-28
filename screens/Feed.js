import React, { useContext, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Audio } from "expo-av"; // Módulo de audio
import Entypo from "@expo/vector-icons/Entypo";
import { AuthContext } from "../context/AuthContext"; // Contexto
import Playlist, { playlist } from "./Playlist"; // Función para obtener playlists

const screenHeight = Dimensions.get("screen").height; // Constante para la altura de la pantalla
let globalSound = null; // Variable global para manejar el sonido activo

// Componente SongItem optimizado con React.memo para evitar renderizados innecesarios
const SongItem = React.memo(({ item, isCurrentSong, onLikePress }) => {
  const [state, setState] = React.useState({
    liked: false,
    sound: null,
    isPlaying: false,
  });

  const { liked, sound, isPlaying } = state;

  // Función para reproducir el preview de la canción
  async function playSound() {
    if (globalSound) {
      await globalSound.stopAsync();
      globalSound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: item.preview_url,
      });
      globalSound = newSound;
      setState((prevState) => ({
        ...prevState,
        sound: newSound,
        isPlaying: true,
      }));
      await newSound.playAsync();
    } catch (error) {
      console.log("Error al reproducir el sonido", error);
    }
  }

  // Función para detener la canción
  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      setState((prevState) => ({ ...prevState, isPlaying: false }));
    }
  }

  React.useEffect(() => {
    if (isCurrentSong) {
      playSound();
    } else {
      stopSound();
    }

    return () => {
      if (sound) {
        sound.unloadAsync(); // Limpia el sonido cuando se desmonta
      }
    };
  }, [isCurrentSong]);

  return (
    <View style={styles.songContainer}>
      <Image
        source={{ uri: item.album.images[0].url }}
        style={styles.backgroundImage}
      />
      <Image
        source={{ uri: item.album.images[0].url }}
        style={styles.image}
        cachePolicy="memory-disk"
        contentFit="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.artist}>{item.artists[0].name}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setState((prevState) => ({ ...prevState, liked: !liked }));
            onLikePress(item); // Llamar la función para mostrar el modal
          }}
        >
          <Entypo
            name={liked ? "heart" : "heart-outlined"}
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => (isPlaying ? stopSound() : playSound())}
        >
          <Entypo
            name={isPlaying ? "controller-paus" : "controller-play"}
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Entypo name="menu" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Entypo name="plus" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function Feed() {
  const { token, getRecommendations, getUserPlaylists } =
    React.useContext(AuthContext);
  const [canciones, setCanciones] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false); // Nuevo estado para el loading
  const [playlists, setPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    fetchSongs(); // Cargar las canciones inicialmente
  }, []);

  // Función para obtener canciones de recomendaciones
  const fetchSongs = async () => {
    if (isLoading) return; // Evita la función si ya está cargando

    setIsLoading(true); // Indica que se está cargando

    try {
      const recommendedTracks = await getRecommendations();
      const filteredTracks = recommendedTracks.filter(
        (track) => track.preview_url
      );
      console.log("Recomendaciones:", filteredTracks);

      // Agrega nuevas canciones a la lista actual
      setCanciones((prevCanciones) => [...prevCanciones, ...filteredTracks]);
    } catch (error) {
      console.log("Error al obtener recomendaciones:", error);
    } finally {
      setIsLoading(false); // Indica que se terminó de cargar
    }
  };

  const fetchPlaylists = async () => {
    try {
      const userPlaylists = await getUserPlaylists(token);
      setPlaylists(userPlaylists);
    } catch (error) {
      console.log("Error al obtener playlists:", error);
    }
  };

  const onLikePress = (song) => {
    setSelectedSong(song);
    fetchPlaylists();
    setModalVisible(true);
  };

  const addToPlaylist = async (playlistId) => {
    try {
      await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [selectedSong.uri] }),
      });
      Alert.alert(
        "Canción guardada",
        "La canción se ha añadido a la playlist."
      );
      setModalVisible(false);
    } catch (error) {
      console.error("Error al añadir canción a la playlist:", error);
      Alert.alert("Error", "No se pudo añadir la canción a la playlist.");
    }
  };

  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <FlatList
        data={canciones}
        renderItem={({ item, index }) => (
          <SongItem
            item={item}
            isCurrentSong={index === currentIndex}
            onLikePress={onLikePress}
          />
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        pagingEnabled
        decelerationRate="fast"
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews={true}
        style={{ flex: 1 }}
        onScroll={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / screenHeight
          );
          setCurrentIndex(index);
        }}
        onEndReached={fetchSongs} // Cargar más canciones al llegar al final
        onEndReachedThreshold={0.5} // Umbral para disparar la carga de más canciones (0.5 significa cuando el usuario esté en la mitad de la pantalla antes del final)
        ListFooterComponent={isLoading ? <Text>Cargando...</Text> : null} // Mostrar un indicador de carga mientras se obtienen nuevas canciones
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Selecciona una playlist</Text>
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.playlistItem}
                  onPress={() => addToPlaylist(playlist.id)}
                >
                  <Image
                    source={{ uri: playlist.images[0].url }}
                    style={styles.playlistImage}
                  />
                  <Text style={styles.playlistName}>{playlist.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: "white" }}>
                No tienes playlists disponibles.
              </Text>
            )}
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="#f44"
            />
          </View>
        </ScrollView>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  songContainer: {
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    opacity: 0.2,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
  },
  artist: {
    color: "white",
  },
  iconContainer: {
    position: "absolute",
    bottom: 110,
    right: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  iconButton: {
    padding: 7,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  playlistName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
