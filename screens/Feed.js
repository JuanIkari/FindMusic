import * as React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Audio } from "expo-av"; // Módulo de audio
import Entypo from "@expo/vector-icons/Entypo";
import { AuthContext } from "../context/AuthContext"; // Contexto

const screenHeight = Dimensions.get("screen").height; // Constante para la altura de la pantalla
let globalSound = null; // Variable global para manejar el sonido activo

// Componente SongItem optimizado con React.memo para evitar renderizados innecesarios
const SongItem = React.memo(({ item, isCurrentSong }) => {
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
          onPress={() =>
            setState((prevState) => ({ ...prevState, liked: !liked }))
          }
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
  const { getRecommendations } = React.useContext(AuthContext);
  const [canciones, setCanciones] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    async function fetchSongs() {
      try {
        const recommendedTracks = await getRecommendations();
        const filteredTracks = recommendedTracks.filter(
          (track) => track.preview_url
        );
        setCanciones(filteredTracks);
      } catch (error) {
        console.error("Error fetching recommendations", error);
      }
    }

    fetchSongs();
  }, []);

  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <FlatList
        data={canciones}
        renderItem={({ item, index }) => (
          <SongItem item={item} isCurrentSong={index === currentIndex} />
        )}
        keyExtractor={(item) => item.id.toString()}
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
      />
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
});
