import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  Dimensions,
} from "react-native";
import React from "react";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

type BannerTypes = {
  title: string;
  description: string;
  image: ImageSourcePropType;
  buttonTitle: string;
  onPress: () => void;
};

const isTablet = width > 600;
export default function Banner({
  title,
  description,
  image,
  onPress,
  buttonTitle,
}: BannerTypes) {
  return (
    <View
      className="bg-white border border-gray-300 rounded-2xl p-4  h-[150px]  flex-row justify-between shadow-lg"
      style={[
        { width: width - 42, height: isTablet ? 250 : 150 }, // Adjust height for tablets
      ]}
    >
      <View className="flex-1">
        <Text className="text-xl text-[#333] font-semibold">{title}</Text>
        <Text className="text-gray-600 mt-1">{description}</Text>
        <TouchableOpacity
          onPress={onPress}
          className="bg-primaryColor rounded-lg absolute bottom-[-3] px-3 py-2 my-3 flex justify-center items-center"
        >
          <Text className="text-white font-semibold text-center">
            {buttonTitle}
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        source={image}
        className="  rounded-lg"
        style={{
          height: isTablet ? 180 : 100,
          width: isTablet ? 180 : 100,
          marginTop: isTablet ? 8 : 3,
        }}
      />
    </View>
  );
}
