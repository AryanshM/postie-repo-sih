import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "@/constants";
import { useFonts } from "expo-font";

interface CartonCardProps {
  cartonID: string;
  to: string;
  totalConsignment: number;
  date: string;
}

const CartonCard = ({ cartonID, to, totalConsignment, date }: CartonCardProps) => {
  const [fontsLoaded] = useFonts({
    RobotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
    RobotoRegular: require("../assets/fonts/Roboto-Regular.ttf"),
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null; // Ensure fonts are loaded before rendering

  return (
    <View className="bg-white mt-4 py-1 px-3 rounded-xl shadow-lg">
      <View className="flex-row gap-4">
        {/* Left Section with Icon */}
        <View className="">
          <Image
            source={icons.cartonIcon}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        {/* Right Section with Details */}
        <View className="flex-1 justify-center">
          <Text className="text-lg font-bold text-gray-800">
            Carton ID: <Text className="font-normal text-gray-600">{cartonID}</Text>
          </Text>
          <Text className="text-sm text-gray-600 ">To: {to}</Text>
          <View className="flex-row items-center ">
            <Text className="text-sm text-gray-600">
              Consignments: {totalConsignment}
            </Text>
            <Text className="text-sm text-gray-500 mx-1">|</Text>
            <Text className="text-sm text-gray-600">Date: {date}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartonCard;
