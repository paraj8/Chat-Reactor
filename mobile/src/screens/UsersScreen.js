import { removeToken, removeUser } from "../utils/storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  disconnectSocket,
  getSocket,
} from "../services/socketService";

import { getUsers } from "../services/userService";
import UserCard from "../components/UserCard";
import { COLORS } from "../utils/constants";

export default function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const handleLogout = async () => {
    try {
      disconnectSocket();

      await removeToken();
      await removeUser();

      navigation.replace("Login");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      console.log("Users API Response:");
      console.log(res.data);

      setUsers(res.data);
    } catch (err) {
      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Data:", err.response.data);
      } else {
        console.log("Message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const socket = getSocket();

    if (socket) {
      socket.on("onlineUsers", (users) => {
        console.log("🟢 Online Users:", users);
        setOnlineUsers(users);
      });
    }

    return () => {
      socket?.off("onlineUsers");
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome 👋</Text>
          <Text style={styles.title}>Chats</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {users.length === 0 ? (
        <Text style={styles.emptyText}>
          No users found
        </Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              isOnline={onlineUsers.includes(item._id)}
              onPress={() =>
                navigation.navigate("Chat", {
                  user: item,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 18,
    paddingTop: 55,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 2,
  },

  logoutButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
});