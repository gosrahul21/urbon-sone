import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { useAuth } from "@/contexts/AuthContext";
import { authApi } from "@/lib/api";

export default function RegisterScreen() {
  const { isLoading, error, clearError } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(""); // YYYY-MM-DD
  const [gender, setGender] = useState("");

  const handleRegister = async () => {
    try {
      clearError();
      if (!firstName || !lastName || !email || !dob) return;

      await authApi.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        dob, // send as string, parse in backend
        gender,
      });
      router.push("/(tabs)");
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="px-5"
      >
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-6">
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        {/* Title */}
        <View className="items-center mb-10">
          <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-6">
            <Ionicons name="person-add" size={40} />
          </View>

          <Text className="text-2xl font-bold">Create Account</Text>
          <Text className="text-sm text-gray-500 mt-1">
            We’ll verify you via OTP
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View className="flex-row items-center bg-red-100 px-4 py-3 rounded-xl mb-4">
            <Ionicons name="alert-circle" size={18} color="red" />
            <Text className="ml-2 text-red-600 text-sm">{error}</Text>
          </View>
        )}

        {/* Form */}
        <View className="gap-4">
          <Input
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            onChangeText={setFirstName}
            leftIcon="person-outline"
          />

          <Input
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            onChangeText={setLastName}
            leftIcon="person-outline"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <DatePicker
            label="Date of Birth"
            placeholder="Select date of birth"
            value={dob}
            onDateChange={setDob}
            leftIcon="calendar-outline"
            maximumDate={new Date()}
          />

          <Select
            label="Gender"
            placeholder="Select gender"
            value={gender}
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
            onSelect={setGender}
            leftIcon="person-outline"
          />

          <Button
            title="Submit"
            loading={isLoading}
            onPress={handleRegister}
            className="mt-4 bg-primary sticky bottom-0"
          />
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-10">
          <Text className="text-sm text-gray-500">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Text className="text-sm font-semibold text-primary">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
