import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  StatusBar,
} from "react-native";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { login } from "../services/authService";
import { saveToken } from "../utils/storage";
import { COLORS } from "../utils/constants";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill all fields.");
    }

    try {
      const res = await login({
        email,
        password,
      });

      await saveToken(res.data.token);

      Alert.alert("Success", "Login Successful!");

      navigation.replace("Users");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <View style={styles.card}>
        <Text style={styles.logo}>⚛</Text>

        <Text style={styles.title}>Chat Reactor</Text>

        <Text style={styles.subtitle}>
          Welcome back, Reactor.
        </Text>

        <View style={styles.form}>
          <CustomInput
            icon="mail-outline"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <CustomInput
            icon="lock-closed-outline"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton
            title="LOGIN"
            onPress={handleLogin}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.link}>
              Don't have an account?
              <Text style={styles.linkHighlight}> Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 22,
  },

  form: {
    gap: 16,
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 15,
  },

  linkHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});