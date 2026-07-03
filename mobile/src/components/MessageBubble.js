import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../utils/constants";

export default function MessageBubble({ message, isMine }) {
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
          isMine ? styles.myBubble : styles.otherBubble,
        ]}
      >
        <Text style={styles.text}>
          {message.message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },

  left: {
    alignItems: "flex-start",
  },

  right: {
    alignItems: "flex-end",
  },

  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },

  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },

  otherBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
  },

  text: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
  },
});