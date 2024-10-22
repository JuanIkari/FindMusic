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
import { Audio } from "expo-av"; // Importamos el módulo de audio
import Entypo from "@expo/vector-icons/Entypo";
import { AuthContext } from "../context/AuthContext"; // Importamos el contexto

let globalSound = null; // Variable global para el sonido activo

// Optimizamos el componente con React.memo para evitar renderizados innecesarios
const SongItem = React.memo(({ item, isCurrentSong }) => {
  const [liked, setLiked] = React.useState(false);
  const [sound, setSound] = React.useState(null); // Estado para manejar el sonido
  const [isPlaying, setIsPlaying] = React.useState(false); // Estado para saber si está reproduciendo

  // Función para reproducir el preview de la canción
  async function playSound() {
    if (globalSound) {
      // Detenemos la canción anterior si existe
      await globalSound.stopAsync();
      globalSound.unloadAsync();
    }

    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: item.preview_url,
      });
      globalSound = sound; // Actualizamos la canción global activa
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.log("Error al reproducir el sonido", error);
    }
  }

  // Función para detener el preview de la canción
  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  }

  // Reproducir automáticamente cuando la canción es la actual en pantalla
  React.useEffect(() => {
    if (isCurrentSong) {
      playSound(); // Reproducir la canción si es la actual
    } else {
      stopSound(); // Pausar la canción si ya no es la actual
    }

    return () => {
      if (sound) {
        sound.unloadAsync(); // Limpiar el sonido al desmontar el componente
      }
    };
  }, [isCurrentSong]);

  return (
    <View style={styles.songContainer}>
      {/* Imagen, nombre y artista de la canción */}
      <Image
        source={{ uri: item.album.images[0].url }}
        style={styles.image}
        cachePolicy="memory-disk" // Cachear imágenes para mejorar el rendimiento
        resizeMode="cover" // Optimiza la visualización de la imagen
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={{ color: "white" }}>{item.artists[0].name}</Text>
      </View>

      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setLiked(!liked)} // Alternar estado al presionar
        >
          <Entypo
            name={liked ? "heart" : "heart-outlined"} // Cambiar ícono según estado
            size={30}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => (isPlaying ? stopSound() : playSound())} // Cambiar el estado al presionar
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

export default function Feed({ navigation }) {
  const { getRecommendations } = React.useContext(AuthContext); // Usamos el contexto para obtener la función de recomendaciones
  const [canciones, setCanciones] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0); // Guardar el índice actual

  React.useEffect(() => {
    async function fetchSongs() {
      const recommendedTracks = await getRecommendations(); // Obtenemos las recomendaciones de Spotify
      const filteredTracks = recommendedTracks.filter(
        (track) => track.preview_url // Filtramos canciones con preview_url
      );
      setCanciones(filteredTracks); // Guardamos solo las canciones filtradas
    }

    fetchSongs();
  }, []);

  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      {/* Render de la lista de canciones */}
      <FlatList
        data={canciones}
        renderItem={({ item, index }) => (
          <SongItem item={item} isCurrentSong={index === currentIndex} />
        )}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        decelerationRate="fast"
        initialNumToRender={10} // Renderiza 10 elementos inicialmente
        windowSize={5} // Mantén montados 5 elementos fuera de la pantalla
        removeClippedSubviews={true} // Mejora el uso de la memoria
        style={{ flex: 1 }}
        onScroll={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / Dimensions.get("screen").height
          );
          setCurrentIndex(index); // Actualizamos el índice de la canción actual
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  songContainer: {
    height: Dimensions.get("screen").height,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
  },
  iconContainer: {
    position: "absolute",
    bottom: 80,
    right: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  iconButton: {
    padding: 10,
  },
});
