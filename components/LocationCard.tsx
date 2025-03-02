import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Location {
  Name: string;
  BranchType: string;
  DeliveryStatus: string;
  Circle: string;
  District: string;
  Division: string;
  Region: string;
  Block: string;
  State: string;
  Country: string;
  Pincode: string;
}

const LocationCard = ({ location }: { location: Location }) => {
  return (
    <View className="bg-white rounded-lg shadow-lg my-5 p-6">
      {/* Header Section */}
      <View className="border-b border-gray-200 pb-4 mb-4">
        <Text className="text-xl font-bold text-gray-800">{location.Name}</Text>
        <Text className="text-md text-gray-600 mt-2">
          {location.BranchType}
        </Text>
      </View>

      {/* Body Section */}
      <View className="space-y-3">
        <DetailRow icon="location-sharp" label="State" value={location.State} />
        <DetailRow icon="md-map" label="District" value={location.District} />
        <DetailRow
          icon="md-business"
          label="Division"
          value={location.Division}
        />
        <DetailRow icon="md-globe" label="Country" value={location.Country} />
        <DetailRow icon="md-pin" label="Pincode" value={location.Pincode} />
        <DetailRow icon="md-cog" label="Circle" value={location.Circle} />
        <DetailRow icon="md-home" label="Block" value={location.Block} />
        <DetailRow
          icon="ios-return-right"
          label="Delivery Status"
          value={location.DeliveryStatus}
        />
      </View>

      {/* Button */}
      <TouchableOpacity className="bg-indigo-600 py-3 rounded-md mt-4 flex justify-center items-center">
        <Text className="text-white text-lg font-semibold">More Info</Text>
      </TouchableOpacity>
    </View>
  );
};

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | null;
}) => (
  <View className="flex-row items-center">
    <Ionicons
      name={icon as keyof typeof Ionicons.glyphMap}
      size={20}
      color="#4B5563"
    />
    <Text className="text-sm font-semibold text-gray-700 ml-3 flex-1">
      {label}:
    </Text>
    <Text className="text-sm text-gray-600">{value || "N/A"}</Text>
  </View>
);

export default LocationCard;
