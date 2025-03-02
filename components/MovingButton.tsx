import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

interface MovingButtonProps {
  moveToBack: () => void;
  moveToNext: () => void;
  className?: string;
}

export default function MovingButton({
  moveToBack,
  moveToNext,
  className,
}: MovingButtonProps) {
  return (
    <View className={`flex-row justify-between  pt-4 pb-6 ${className} `}>
      <TouchableOpacity
        onPress={moveToBack}
        className="bg-[#212121] flex-1 py-4 rounded-lg mr-2"
      >
        <Text className="text-white text-center font-semibold">Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={moveToNext}
        className="bg-primaryColor flex-1 py-4 rounded-lg ml-2"
      >
        <Text className="text-white text-center font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  );
}
