import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/constants";

export default function UserCard({ user, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.avatar}>
        <Ionicons
          name="person"
          size={26}
          color="#fff"
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {user.username}
        </Text>

        <Text style={styles.email}>
          {user.email}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={22}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },

  email: {
    color: COLORS.textSecondary,
    marginTop: 3,
    fontSize: 13,
  },
});