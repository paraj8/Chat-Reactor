import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/constants";

export default function UserCard({
  user,
  onPress,
  isOnline,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.avatar}>
        <Ionicons
          name="person"
          size={26}
          color="#fff"
        />

        {/* Online Indicator */}
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: isOnline
                ? "#22C55E"
                : "#6B7280",
            },
          ]}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>
          {user.username}
        </Text>

        <Text style={styles.email}>
          {user.email}
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: isOnline
                ? "#22C55E"
                : COLORS.textSecondary,
            },
          ]}
        >
          {isOnline ? "Online" : "Offline"}
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
    position: "relative",
  },

  statusDot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.card,
    bottom: 0,
    right: 0,
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
    marginTop: 2,
    fontSize: 13,
  },

  status: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
});