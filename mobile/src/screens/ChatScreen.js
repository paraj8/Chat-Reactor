import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "../utils/constants";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";

import {
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../services/messageService";

import { getUser } from "../utils/storage";
import { getSocket } from "../services/socketService";

export default function ChatScreen({ navigation, route }) {
  const { user } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const insets = useSafeAreaInsets();

  const flatListRef = useRef(null);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const socket = getSocket();

    if (!socket) return;

    const handleReceiveMessage = async (newMessage) => {
      const isCurrentChat =
        (newMessage.sender === currentUser.id &&
          newMessage.receiver === user._id) ||
        (newMessage.sender === user._id &&
          newMessage.receiver === currentUser.id);

      if (!isCurrentChat) return;

      setMessages((prev) => [...prev, newMessage]);

      if (newMessage.sender === user._id) {
        try {
          await markMessagesAsRead(user._id);

          socket.emit("messagesRead", {
            senderId: user._id,
            readerId: currentUser.id,
          });
        } catch (err) {
          console.log("Read error:", err.response?.data || err.message);
        }
      }

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    };

    const handleMessagesRead = ({ readerId }) => {
      if (readerId !== user._id) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.sender === currentUser.id
            ? {
                ...msg,
                isRead: true,
              }
            : msg
        )
      );
    };

    const handleOnlineUsers = (users) => {
      setIsOnline(users.includes(user._id));
    };

    const handleUserOnline = (id) => {
      if (id === user._id) {
        setIsOnline(true);
      }
    };

    const handleUserOffline = (id) => {
      if (id === user._id) {
        setIsOnline(false);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messagesRead", handleMessagesRead);
    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messagesRead", handleMessagesRead);
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
    };
  }, [currentUser]);

  const initialize = async () => {
    try {
      const me = await getUser();

      if (!me) return;

      setCurrentUser(me);

      const res = await getMessages(user._id);

      setMessages(res.data);

      try {
        await markMessagesAsRead(user._id);

        const socket = getSocket();

        if (socket) {
          socket.emit("messagesRead", {
            senderId: user._id,
            readerId: me.id,
          });
        }
      } catch (err) {
        console.log("Read receipt:", err.response?.data || err.message);
      }

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: false,
        });
      }, 100);
    } catch (err) {
      console.log("Initialize:", err.response?.data || err.message);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const res = await sendMessage(user._id, text);

      setMessages((prev) => [...prev, res.data]);

      setText("");

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={22}
            color="#fff"
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user.username}</Text>

          <Text style={styles.status}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
          styles.messages,
          {
            paddingBottom: 10 + insets.bottom,
          },
          ]}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({
              animated: true,
            })
          }
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 14,
  },

  name: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },

  status: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },

  messages: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});