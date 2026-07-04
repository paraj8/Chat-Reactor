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
} from "../services/messageService";

import { getUser } from "../utils/storage";
import { getSocket } from "../services/socketService";

export default function ChatScreen({ navigation, route }) {
  const { user } = route.params;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const flatListRef = useRef(null);

  useEffect(() => {
    loadUser();
    loadMessages();
  }, []);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    socket.off("receiveMessage");

    socket.on("receiveMessage", (newMessage) => {
      // Only add messages for this conversation
      if (
        currentUser &&
        (
          (newMessage.sender === currentUser.id &&
            newMessage.receiver === user._id) ||
          (newMessage.sender === user._id &&
            newMessage.receiver === currentUser.id)
        )
      ) {
        setMessages((prev) => [...prev, newMessage]);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({
            animated: true,
          });
        }, 100);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

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
    {/* Header */}
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
          Online
        </Text>
      </View>
    </View>

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messages}
        keyboardShouldPersistTaps="handled"
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
)};