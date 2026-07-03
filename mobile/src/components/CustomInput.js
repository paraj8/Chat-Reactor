import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/constants";

export default function CustomInput({
  icon = "person-outline",
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
}) {
  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={20}
        color={COLORS.primary}
        style={styles.icon}
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        selectionColor={COLORS.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",

    height: 58,

    backgroundColor: COLORS.surface,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: COLORS.border,

    paddingHorizontal: 16,
  },

  icon: {
    marginRight: 12,
  },

  input: {
    flex: 1,

    color: COLORS.text,

    fontSize: 16,
  },
});