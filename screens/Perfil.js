import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Perfil({ navigation }) {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Foto de perfil */}
        <Image
          source={{
            uri: "https://wallpapers.com/images/hd/anime-profile-picture-jioug7q8n43yhlwn.jpg",
          }}
          style={styles.profileImage}
        />

        {/* Nombre de usuario */}
        <Text style={styles.userName}>Alespollo</Text>

        {/* Opciones del perfil */}
        <View style={styles.optionsContainer}>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              /* Navegar a editar perfil */
            }}
          >
            <MaterialIcons
              name="edit"
              size={24}
              color="white"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Editar Perfil</Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              /* Navegar a configuración de privacidad */
            }}
          >
            <MaterialIcons
              name="lock-outline"
              size={24}
              color="white"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Privacidad</Text>
          </Pressable>
          <Pressable
            style={styles.optionButton}
            onPress={() => {
              /* Navegar a historial de actividad */
            }}
          >
            <MaterialIcons
              name="history"
              size={24}
              color="white"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Historial de Actividad</Text>
          </Pressable>
        </View>

        {/* Botón de cerrar sesión (reset) */}
        <Pressable
          style={styles.sesionButton}
          onPress={() => {
            navigation.reset({ routes: [{ name: "Register" }] });
          }}
        >
          <Text style={styles.sesionText}>Cerrar Sesión</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 140,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 20,
  },
  userName: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
  },
  optionsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 100,
  },
  optionButton: {
    flexDirection: "row",
    backgroundColor: "#190633",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
    alignItems: "center",
  },
  optionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  optionIcon: {
    marginRight: 15,
  },
  sesionButton: {
    backgroundColor: "purple",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 100,
  },
  sesionText: {
    color: "white",
    fontWeight: "bold",
  },
});
