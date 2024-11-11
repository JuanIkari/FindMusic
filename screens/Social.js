import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";

export default function Social() {
  const [friends, setFriends] = useState([]); // Lista de amigos, inicializada vacía para mostrar el mensaje si no hay amigos.
  const [modalVisible, setModalVisible] = useState(false); // Control del modal de búsqueda
  const [searchQuery, setSearchQuery] = useState(""); // Estado para el texto de búsqueda
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Amigos</Text>

          {/* Botón para abrir el modal de búsqueda */}
          <Pressable onPress={() => setModalVisible(true)}>
            <Entypo name="magnifying-glass" size={32} color="white" />
          </Pressable>
        </View>

        {/* Modal para buscar amigos */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Buscar amigo</Text>
              <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                placeholderTextColor="#ccc"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <View style={styles.modalButtons}>
                <Pressable onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </Pressable>
                <Pressable 
                  onPress={() => {
                    // Aquí agregarás la lógica de búsqueda
                    console.log("Buscar:", searchQuery);
                    setModalVisible(false);
                  }} 
                  style={styles.searchButton}
                >
                  <Text style={styles.buttonText}>Buscar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {friends.length === 0 ? (
          <Text style={styles.noFriendsText}>Todavía no has agregado a alguien</Text>
        ) : (
          <FlatList
            data={friends}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View style={styles.friendItem}>
                  <Text style={styles.friendName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: "30%" }}
          />
        )}
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "97%",
    marginBottom: 60,
  },
  title: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  noFriendsText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: "#333",
    width: "100%",
  },
  friendName: {
    fontSize: 16,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 15,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#444",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#f44",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});