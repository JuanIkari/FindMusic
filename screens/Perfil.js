import * as React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Perfil({ navigation }) {
  const { logout, user } = useContext(AuthContext);

  // Asegúrate de que el nombre y la imagen se actualicen al cambiar el contexto
  useEffect(() => {
    // Aquí podrías agregar lógica adicional si es necesario
  }, [user]);

  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Foto de perfil */}
        <Image
          source={{
            uri: user.profileImage || "https://default-profile-url.jpg",
          }}
          style={styles.profileImage}
        />

        {/* Nombre de usuario */}
        <Text style={styles.userName}>{user.name || "Nombre no disponible"}</Text>
        <Text style={styles.user_followers}>Seguidores: {user.followers}</Text>

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
            logout();
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
  user_followers: {
    fontSize: 14,
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
    marginTop: 30,
  },
  sesionText: {
    color: "white",
    fontWeight: "bold",
  },
});
