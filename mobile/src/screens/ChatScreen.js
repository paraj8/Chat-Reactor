import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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

const flatListRef = useRef(null);

useEffect(() => {
  initialize();
}, []);

useEffect(() => {
  if (!currentUser) return;

  const socket = getSocket();

  if (!socket) return;

  socket.off("receiveMessage");
  socket.off("messagesRead");
  socket.off("onlineUsers");
  socket.off("userOnline");
  socket.off("userOffline");

  // Receive new message
  socket.on("receiveMessage", async (newMessage) => {
    if (
      (newMessage.sender === currentUser.id &&
        newMessage.receiver === user._id) ||
      (newMessage.sender === user._id &&
        newMessage.receiver === currentUser.id)
    ) {
      setMessages((prev) => [...prev, newMessage]);

      // If we receive a message while chat is open,
      // mark it as read immediately.
      if (newMessage.sender === user._id) {
        await markMessagesAsRead(user._id);

        socket.emit("messagesRead", {
          senderId: user._id,
          readerId: currentUser.id,
        });
      }

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({
          animated: true,
        });
      }, 100);
    }
  });

  // Sender receives read receipt
  socket.on("messagesRead", ({ reader }) => {
    if (reader !== user._id) return;

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
  });

  // Initial online users
  socket.on("onlineUsers", (users) => {
    setIsOnline(users.includes(user._id));
  });

  socket.on("userOnline", (id) => {
    if (id === user._id) {
      setIsOnline(true);
    }
  });

  socket.on("userOffline", (id) => {
    if (id === user._id) {
      setIsOnline(false);
    }
  });

  return () => {
    socket.off("receiveMessage");
    socket.off("messagesRead");
    socket.off("onlineUsers");
    socket.off("userOnline");
    socket.off("userOffline");
  };
}, [currentUser]);

const initialize = async () => {
  const me = await getUser();

  setCurrentUser(me);

  await loadMessages();

  // Mark unread messages as read
  await markMessagesAsRead(user._id);

  const socket = getSocket();

  if (socket) {
    socket.emit("messagesRead", {
      senderId: user._id,
      readerId: me.id,
    });
  }
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
    const res = await sendMessage(user._id, text);

    setMessages((prev) => [...prev, res.data]);

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
          <Text style={styles.name}>
            {user.username}
          </Text>

          <Text style={styles.status}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.messages}
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