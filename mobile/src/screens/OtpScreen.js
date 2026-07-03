import { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { register } from "../services/authService";

export default function OtpScreen({ navigation, route }) {
  const [otp, setOtp] = useState("");

  const { username, email, password } = route.params;

  const handleVerifyOtp = async () => {
    if (!otp) {
      return Alert.alert("Error", "Please enter OTP.");
    }

    try {
      await register({
        username,
        email,
        password,
        otp,
      });

      Alert.alert("Success", "Account created successfully!");

      navigation.replace("Login");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>
        Enter the OTP generated for
      </Text>

      <Text style={styles.email}>
        {email}
      </Text>

      <CustomInput
        placeholder="6-digit OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />

      <CustomButton
        title="Verify & Register"
        onPress={handleVerifyOtp}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#64748B",
    marginBottom: 5,
  },

  email: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 25,
  },
});