import * as React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Perfil({ navigation }) {
  const { logout, user } = useContext(AuthContext);
  const [showProduct, setShowProduct] = useState(false); // Estado para controlar la visibilidad del tipo de cuenta

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
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{user.name || "Nombre no disponible"}</Text>
          {user.product === "premium" && (  
            <Pressable 
              onPressIn={() => setShowProduct(true)}    // Muestra el tooltip al presionar
              onPressOut={() => setShowProduct(false)}  // Oculta el tooltip al soltar
            >
              <MaterialCommunityIcons name="crown" size={30} color="#ffcb05" style={styles.crownIcon}/>
            </Pressable>
          )}
        </View>

        {/* Función que muestra el tipo de cuenta */}
        {showProduct && (
          <View style={styles.product}>
            <Text style={styles.product_text}>{user.product}</Text>
          </View>
        )}

        <Text style={styles.user_followers}>{user.followers} seguidores</Text>

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
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  crownIcon: {
    marginLeft: 10,
  },
  product: {
    position: "absolute",
    top: 325, // Ajusta según la posición que necesites
    right: 145, // Ajusta según la posición que necesites
    backgroundColor: "#00000075",
    padding: 8,
    borderRadius: 5,
    zIndex: 1,
  },
  product_text: {
    color: "#ffcb05",
    fontWeight: "bold",
    fontSize: 14,
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
    marginTop: 50,
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
