import { View, Text, Image } from "react-native";
import React from "react";
import icons from "../constants/icons";

const Card: React.FC<{ lang: string }> = ({ lang }) => {
  return (
    <View className=" rounded-lg bg-white p-6  my-1 flex-row items-center justify-between w-[90%] mx-auto border border-gray-100">
      <Text className="text-lg font-semibold text-gray-800">{lang}</Text>
      <Image className="w-6 h-6 opacity-70" source={icons.rightarrow} />
    </View>
  );
};

export default Card;
