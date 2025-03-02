import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import { images } from "@/constants";
import { ProgressBar } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
export default function ProgreessConsigment({
  currentSteps,
  heading,
  subheading,
  handleBack,
}: {
  currentSteps: number;
  heading?: string;
  subheading?: string;
  handleBack: () => void;
}) {
  const router = useRouter();
  const width = Dimensions.get("window").width;
  // Steps configuration
  const steps = [
    { id: 1, name: "Article Details", image: images.articleDetails },
    { id: 2, name: "Address Details", image: images.addressDetails },

    { id: 4, name: "Item Details", image: images.itemDetails },
    { id: 5, name: "Payment", image: images.pay },
  ];

  const isTablet = width > 600;
  return (
    <View>
      <View
        style={{
          position: "absolute",
        }}
      >
        <TouchableOpacity onPress={handleBack}>
          <Text
            style={{
              fontSize: 45,
              color: "#CD3431",
            }}
          >
            ←
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <View>
          <View className="mx-4 my-8">
            <Text className="text-3xl font-bold text-headingColor text-center ">
              {heading}
            </Text>

            {/* Sub Heading */}
            <Text className="text-sm text-gray-500 text-center mt-1">
              {subheading}
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar with Circles */}
      <View className={`${isTablet ? "mx-7 mt-10 mb-4" : "mx-4 my-1"}`}>
        {/* Progress Bar */}
        <ProgressBar
          progress={currentSteps / steps.length}
          color="#CD3431"
          style={{
            height: 5,
            borderRadius: 10,
            backgroundColor: "#888888",
            opacity: 0.6,
          }}
          className="h-2 rounded "
        />

        {/* Step Indicators */}
        <View className="flex-row -mx-[3%] justify-between items-center -mt-[6%]">
          {steps.map((step, index) => (
            <View key={step.id} className="items-center">
              <View>
                <Image
                  source={step.image}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
              </View>

              {/* Step Name */}
              <Text
                className={`text-xs mt-2 ${
                  index + 1 <= currentSteps
                    ? "text-primaryColor font-bold"
                    : "text-gray-400"
                }`}
              >
                {step.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
