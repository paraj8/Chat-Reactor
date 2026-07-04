import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/constants";

export default function MessageBubble({
  message,
  isMine,
}) {
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <View
      style={[
        styles.container,
        isMine ? styles.right : styles.left,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isMine
            ? styles.myBubble
            : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isMine && styles.myText,
          ]}
        >
          {message.message}
        </Text>

        {!!time && (
          <View style={styles.footer}>
            <Text
              style={[
                styles.time,
                isMine && styles.myTime,
              ]}
            >
              {time}
            </Text>

            {isMine && (
              <Ionicons
                name={
                  message.isRead
                    ? "checkmark-done"
                    : "checkmark"
                }
                size={14}
                color={
                  message.isRead
                    ? "#38BDF8"
                    : "rgba(255,255,255,0.75)"
                }
                style={styles.check}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },

  left: {
    alignItems: "flex-start",
  },

  right: {
    alignItems: "flex-end",
  },

  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
  },

  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 5,
  },

  otherBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 5,
  },

  text: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.text,
  },

  myText: {
    color: "#fff",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },

  time: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },

  myTime: {
    color: "rgba(255,255,255,0.75)",
  },

  check: {
    marginLeft: 4,
  },
});