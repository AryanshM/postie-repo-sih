import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import ProgreessConsigment from "@/components/ProgreessConsigment";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import MovingButton from "@/components/MovingButton";
import { useSelector } from "react-redux";

export default function ItemDetails() {
  const router = useRouter();

  const moveToBack = () => {
    router.push("/(home-screen)/(nsh)/(services)/(book-consigmnet)/ReceiverDetails");
  };

  const moveToNext = () => {
    router.push("/(home-screen)/(nsh)/(services)/(book-consigmnet)/Pay");
  };

  // Fetch Redux state using useSelector
  const senderDetails = useSelector(
    (state: any) => state?.consignment?.senderDetails,
  );
  const receiverDetails = useSelector(
    (state: any) => state?.consignment?.receiverDetails,
  );
  const articleDetails = useSelector(
    (state: any) => state?.consignment?.articleDetails,
  );
  const fareDetails = useSelector(
    (state: any) => state?.consignment?.fareDetails,
  );

  // Special badge for Speed Post
  const isSpeedPost = articleDetails?.service === "speedpost";

  return (
    <View className="flex-1 bg-gray-100 px-4 pb-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Progress Bar */}
        <ProgreessConsigment
          currentSteps={4}
          heading="Order Summary"
          subheading="Review your parcel details and proceed for payment"
          handleBack={moveToBack}
        />

        {/* Package Details */}
        <View
          className={`bg-white rounded-xl shadow-lg p-4 mt-8 mb-4 ${
            isSpeedPost
              ? "border-l-4 border-blue-500"
              : "border-l-4 border-gray-300"
          }`}
        >
          <View className="flex-row items-center gap-4">
            <View className="relative">
              {/* Package Image */}
              <Image source={images.pacKage} className="w-20 h-20 rounded-lg" />
              {/* Badge for Speed Post */}
              {isSpeedPost && (
                <View className="absolute -top-2 -right-2 bg-blue-500 px-2 py-1 rounded-full">
                  <Text className="text-xs font-semibold text-white">
                    Speed 🚀
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-1">
              {/* Delivery Type Heading */}
              <Text
                className={`text-lg font-bold mb-1 ${
                  isSpeedPost ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {isSpeedPost
                  ? "Speed Post - Priority Delivery"
                  : "Normal Delivery"}
              </Text>
              {/* Package Details */}
              {articleDetails?.type === "parcel" && (
                <View className="space-y-1">
                  <Text className="text-sm text-gray-600">
                    Weight:{" "}
                    <Text className="font-semibold">
                      {articleDetails?.weight} gm
                    </Text>
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Dimensions:{" "}
                    <Text className="font-semibold">
                      {articleDetails?.height}x{articleDetails?.width}x
                      {articleDetails?.length} cm
                    </Text>
                  </Text>
                </View>
              )}
              <Text className="text-sm text-gray-600 mt-1">
                Type:{" "}
                <Text className="font-semibold">{articleDetails?.type}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Sender and Receiver Details */}
        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <View className="flex-row items-center space-x-2 mb-2">
            <Ionicons name="person-circle-outline" size={24} color="#4CAF50" />
            <Text className="text-lg font-semibold text-gray-800">
              Sender Details
            </Text>
          </View>
          <Text className="text-sm text-gray-600 ml-6">
            {senderDetails?.first_name} {senderDetails?.last_name},{" "}
            {senderDetails?.address_details}, {senderDetails?.city_district},{" "}
            {senderDetails?.state}, {senderDetails?.pincode}
          </Text>
        </View>

        <View className="bg-white rounded-lg shadow-md p-4 mb-4">
          <View className="flex-row items-center space-x-2 mb-2">
            <Ionicons name="location-outline" size={24} color="#4CAF50" />
            <Text className="text-lg font-semibold text-gray-800">
              Receiver Details
            </Text>
          </View>
          <Text className="text-sm text-gray-600 ml-6">
            {receiverDetails?.first_name} {receiverDetails?.last_name},{" "}
            {receiverDetails?.address_details}, {receiverDetails?.city_district}
            , {receiverDetails?.state}, {receiverDetails?.pincode}
          </Text>
        </View>

        {/* Pricing Details */}
        <View className="bg-white rounded-lg shadow-md p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Pricing Details
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Item Charges:</Text>
            <Text className="text-sm font-semibold text-gray-800">
              ₹{fareDetails?.cost}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Pickup Charges:</Text>
            <Text className="text-sm font-semibold text-gray-800">
              ₹{fareDetails?.deliveryCharge || 0}
            </Text>
          </View>
          <View className="border-t border-gray-300 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold text-gray-800">Total:</Text>
            <Text className="text-lg font-bold text-orange-500">
              ₹{(fareDetails?.cost || 0) + (fareDetails?.deliveryCharge || 0)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <MovingButton moveToBack={moveToBack} moveToNext={moveToNext} />
    </View>
  );
}
