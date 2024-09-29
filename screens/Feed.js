import * as React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'expo-image';
import { Video } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';

const canciones = [
  {
    id: 1,
    nombre: "Routines In The Night",
    artista: "Twenty One Pilots",
    imagen: "https://cdns-images.dzcdn.net/images/cover/4f2819429ed92d35a649d609e39b29b5/0x1900-000000-80-0-0.jpg",
    video: "https://canvaz.scdn.co/upload/artist/3YQKmKGau1PzlVlkL1iodx/video/ec70d4f013bc4db89e1e827a0670d03e.cnvs.mp4"
  },
  {
    id: 2,
    nombre: "Ciudad de la Paz",
    artista: "Dillom",
    imagen: "https://cdns-images.dzcdn.net/images/cover/0a462daf4e2f01144ac75fe08130e8ea/0x1900-000000-80-0-0.jpg",
    video: "https://canvaz.scdn.co/upload/artist/4cJD9t5QBFTUQcd3xfbOb2/video/3ce3fe720c1344ea80302b9a3128b7d7.cnvs.mp4"
  },
  {
    id: 3,
    nombre: "Ecstasy",
    artista: "XXXTentacion, Noah Cyrus",
    imagen: "https://cdns-images.dzcdn.net/images/cover/cec40f144f8dda85a284559d1d052b30/0x1900-000000-80-0-0.jpg",
    video: "https://canvaz.scdn.co/upload/artist/15UsOTVnJzReFVN1VCnxy4/video/e1de2e4f58b54e79984118654f38569e.cnvs.mp4"
  },
  {
    id: 4,
    nombre: "Rackz got më",
    artista: "Yeat, Gunna",
    imagen: "https://cdns-images.dzcdn.net/images/cover/1f04ad81a020bf43d986cdfd76b22146/500x500.jpg",
    video: "https://canvaz.scdn.co/upload/licensor/7JGwF0zhX9oItt9901OvB5/video/6fa67f1761ae4fb49af1e817d1c8a094.cnvs.mp4"
  },
  {
    id: 5,
    nombre: "Starboy",
    artista: "The Weeknd, Daft Punk",
    imagen: "https://i1.sndcdn.com/artworks-000195616860-vexfd1-t500x500.jpg",
    video: "https://canvaz.scdn.co/upload/licensor/7JGwF0zhX9oItt9901OvB5/video/f6e421356c8d44ec80395bae6ff12755.cnvs.mp4"
  },
];

const SongItem = ({ item }) => {
  const videoRef = React.useRef(null);  // Crea una referencia para el video

  return (
    <View style={styles.songContainer}>
      <Video
        ref={videoRef}
        source={{ uri: item.video }}
        style={styles.video}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />

      <Image source={{ uri: item.imagen }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.nombre}</Text>
        <Text style={{ color: 'white' }}>{item.artista}</Text>
      </View>
    </View>
  );
};

export default function Feed({ navigation }) {
  return (
    <LinearGradient colors={['#0C0322', '#190633']} style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.reset({ routes: [{ name: "Register" }] })}>
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>
      <FlatList
        data={canciones}
        renderItem={({ item }) => <SongItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        decelerationRate="fast"
        style={{ flex: 1 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  songContainer: {
    height: Dimensions.get("screen").height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  backButton: {
    position: 'absolute',
    top: 40, // Ajusta según sea necesario
    left: 20, // Ajusta según sea necesario
    zIndex: 1, // Asegúrate de que esté por encima del contenido
  }
});