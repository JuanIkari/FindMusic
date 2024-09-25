import * as React from "react";
import { View, Text, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Pantalla de configuraciones simple
export default function Feed({ navigation }) {
  return (
    <LinearGradient colors={['#0C0322','#190633']} style={{flex: 1}}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Feed</Text>
        <Button
          title="reset"
          onPress={() => navigation.reset({ routes: [{ name: "Register" }] })}
        />
      </View>
    </LinearGradient>
  );
}
