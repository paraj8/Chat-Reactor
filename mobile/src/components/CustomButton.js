import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { COLORS } from "../utils/constants";

export default function CustomButton({
  title,
  onPress,
  loading = false,
}) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.primary,

    marginTop: 5,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.45,
    shadowRadius: 12,

    elevation: 10,
  },

  text: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 1,
  },
});