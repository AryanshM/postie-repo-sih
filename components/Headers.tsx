import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
export default function Headers({
  heading,
  back,
}: {
  heading: string;
  back: () => void;
}) {
  return (
    <View className="flex-row items-center mt-6">
    <TouchableOpacity
      onPress={back}
      className="p-2 bg-[#ECECEC] rounded-full"
    >
      <Ionicons name="arrow-back-outline" size={26} color="#333" />
    </TouchableOpacity>
    <Text
      className="text-xl font-semibold ml-4"
     
    >
      {heading}
    </Text>
  </View>
  )
}
