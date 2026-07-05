import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../utils/constants";

export default function ChatInput({
  value,
  onChangeText,
  onSend,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor={COLORS.placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={onSend}
        activeOpacity={0.8}
      >
        <Ionicons
          name="send"
          size={22}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,

    backgroundColor: COLORS.card,
    color: COLORS.text,

    borderRadius: 24,

    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  button: {
    width: 48,
    height: 48,
    marginLeft: 10,

    borderRadius: 24,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",
  },
});