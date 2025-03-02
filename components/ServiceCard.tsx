import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Image, ImageSourcePropType } from "react-native";

type ServiceCardProps = {
  image: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  className?: string;
};

export default function ServiceCard({
  image,
  title,
  onPress,
  className,
}: ServiceCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-4 w-[48%]`}
      style={{
        elevation: 3,
        shadowColor: "rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        borderRadius: 16,
      }}
    >
      {/* Image */}
      <View
        className="w-full h-24 rounded-lg mb-4 justify-center items-center"
        style={{
          backgroundColor: "#F9F9F9",
          borderRadius: 12,
        }}
      >
        <Image
          source={image}
          className={`w-20 h-20 ${className}`}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text
        className="text-lg font-semibold text-gray-800 text-center"
        style={{
          color: "#2E2E2E",
          marginTop: 8,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
