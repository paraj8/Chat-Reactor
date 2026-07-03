import { removeToken } from "../utils/storage";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { getUsers } from "../services/userService";
import UserCard from "../components/UserCard";
import { COLORS } from "../utils/constants";

const handleLogout = async () => {
  await removeToken();
  navigation.replace("Login");
};

export default function UsersScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

      <TouchableOpacity onPress={handleLogout}>
  <Text style={{ color: "red", marginBottom: 10 }}>
    Logout
  </Text>
</TouchableOpacity>

      <Text style={styles.title}>Chats</Text>

      {!loading && users.length === 0 && (
        <Text style={{ color: "#999", textAlign: "center", marginTop: 20 }}>
          No users found
        </Text>
      )}
      
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() =>
              navigation.navigate("Chat", {
                user: item,
              })
            }
          />
        )}
      />
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

  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 25,
  },
});