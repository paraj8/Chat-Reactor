import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";

import { COLORS } from "../utils/constants";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";

import {
  getMessages,
  sendMessage,
} from "../services/messageService";

import { getUser } from "../utils/storage";

export default function ChatScreen({ route }) {
  const { user } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const flatListRef = useRef();

  useEffect(() => {
    loadUser();
    loadMessages();
  }, []);

  const loadUser = async () => {
    const me = await getUser();
    setCurrentUser(me);
  };

  const loadMessages = async () => {
    try {
      const res = await getMessages(user._id);
      setMessages(res.data);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: false,
        });
      }, 100);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await sendMessage(
        user._id,
        text
      );

      setMessages((prev) => [
        ...prev,
        res.data,
      ]);

      setText("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {user.username}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{
          padding: 15,
        }}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isMine={
              currentUser &&
              item.sender === currentUser.id
            }
          />
        )}
      />

      <ChatInput
        value={text}
        onChangeText={setText}
        onSend={handleSend}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },

  name: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
});