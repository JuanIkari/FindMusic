import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Social() {
  return (
    <LinearGradient colors={["#0C0322", "#190633"]} style={{ flex: 1 }}>
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
});
