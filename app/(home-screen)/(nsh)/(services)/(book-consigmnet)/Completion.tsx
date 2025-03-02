import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
const OrderCompletedScreen = () => {
  const router = useRouter();
  const moveToNext = () => {
    router.push("/(home-screen)/(nsh)/(tabs)/Home");
  };
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      {/* Celebration Animation */}
      <LottieView
        source={require("../../../../../assets/images/orderCompletion.json")}
        autoPlay
        loop={true}
        style={{ width: 400, height: 350 }}
      />

      <View className="flex w-4/5 justify-center items-center -mt-[10%]">
        {/* Order Confirmation Text */}
        <Text className="text-2xl -mt-2 font-bold text-primaryColor mb-2">
          Order Successful!
        </Text>
        <Text className="text-gray-600 text-center px-8">
          Thank you for your purchase! Your order will be delivered soon.
        </Text>
      </View>
      {/* Go to Home Button */}
      <TouchableOpacity
        className="mt-10 bg-primaryColor py-3 px-8 rounded-lg"
        onPress={moveToNext}
      >
        <Text className="text-white font-bold text-lg">Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCompletedScreen;
