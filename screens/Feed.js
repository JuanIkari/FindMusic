import * as React from "react";
import { View, Text, Button } from "react-native";

// Pantalla de configuraciones simple
export default function Feed({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Feed</Text>
      <Button
        title="reset"
        onPress={() => navigation.reset({ routes: [{ name: "Register" }] })}
      />
    </View>
  );
}
