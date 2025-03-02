import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import ProtectedRoute from "@/components/ProtectedRoute";

const _layout = () => {
  return (
    <ProtectedRoute allowedType="hpo">
      <Stack screenOptions={{ headerShown: false }} />
    </ProtectedRoute>
  );
};

export default _layout;
