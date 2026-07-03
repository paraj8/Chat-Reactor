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
import { sendOtp } from "../services/authService";
import { COLORS } from "../utils/constants";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSendOtp = async () => {
    if (!username || !email || !password) {
      return Alert.alert("Error", "Please fill all fields.");
    }

    try {
      await sendOtp({
        username,
        email,
        password,
      });

      navigation.navigate("OTP", {
        username,
        email,
        password,
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
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
          Join the reactor and start chatting.
        </Text>

        <View style={styles.form}>
          <CustomInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <CustomInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton
            title="CREATE ACCOUNT"
            onPress={handleSendOtp}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.link}>
            Already have an account?
            <Text style={styles.linkHighlight}> Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: 22,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 10,
  },

  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
  },

  subtitle: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 35,
    fontSize: 15,
  },

  form: {
    gap: 16,
  },

  link: {
    marginTop: 25,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 15,
  },

  linkHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});