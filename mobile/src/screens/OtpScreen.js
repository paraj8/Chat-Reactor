import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { register } from "../services/authService";
import { COLORS } from "../utils/constants";

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

      Alert.alert(
        "Success",
        "Account created successfully!"
      );

      navigation.replace("Login");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <Text style={styles.logo}>🔐</Text>

              <Text style={styles.title}>
                Verify OTP
              </Text>

              <Text style={styles.subtitle}>
                Enter the verification code sent to
              </Text>

              <Text style={styles.email}>
                {email}
              </Text>

              <View style={styles.form}>
                <CustomInput
                  icon="key-outline"
                  placeholder="6-digit OTP"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                />

                <CustomButton
                  title="VERIFY & REGISTER"
                  onPress={handleVerifyOtp}
                />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  logo: {
    fontSize: 56,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: 1,
  },

  subtitle: {
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
  },

  email: {
    color: COLORS.primary,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 28,
  },

  form: {
    gap: 16,
  },
});