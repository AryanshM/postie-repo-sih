import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import api from "@/hooks/api/retrievToken";
import * as SecureStore from "expo-secure-store";
import { useSelector } from "react-redux";
import { resetUserData } from "@/redux/slices/userDataSlice";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

const width = Dimensions.get("window").width;

export default function Profile() {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("personal");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [email, setEmail] = useState("pt.verify@gmail.com");
  const { data, status, error } = useSelector((state: any) => state.userData);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");
  const isTablet = width > 600;

  // Logout Handling
  const handleLogout = async () => {
    setIsModalVisible(false);
    setLoading(true);
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      dispatch(resetUserData());
      router.replace("/(auth)/Login");
    } catch (error) {
      console.log(error);
      setError("Please try again later.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
    setLoading(false);
  };

  // Account Deletion Handling
  const handleDelete = async () => {
    setLoading(true);
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (accessToken) {
        const response = await api.delete("/customer/customerdelete/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response?.status === 200) {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          router.replace("/(auth)/Login");
        }
      }
    } catch (error) {
      console.log(error);
      setError("Please try again later.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
    setLoading(false);
  };

  return (
    <ScrollView className="h-full bg-screenBackgroundColor">
      <View className="flex-1 bg-primaryColor">
        {/* Header Section */}
        <View
          className="w-full bg-primaryColor"
          style={[{ height: isTablet ? "15%" : "10%" }]}
        >
          <View className="mt-[3%] flex flex-row p-2 text-center mx-auto">
            <Text className="text-3xl mt-2 text-center text-screenBackgroundColor font-semibold">
              My Profile
            </Text>
          </View>
        </View>

        {/* Profile Image */}
        <View
          className="w-36 h-36 z-10 rounded-full border-2 border-gray-500 mx-auto bg-white"
          style={[{ position: "relative", top: isTablet ? "2%" : "5%" }]}
        >
          <Image
            source={{
              uri: "https://th.bing.com/th/id/OIP._wzrOCy6F1cV-gE-Qzn04gHaHa?w=206&h=206&c=7&r=0&o=5&dpr=1.3&pid=1.7",
            }}
            className="w-32 h-32 rounded-full mx-auto my-auto"
          />
        </View>

        {/* Main Section */}
        <View className="flex-1 bg-screenBackgroundColor mt-[-10%] rounded-t-3xl p-6">
          {/* Tabs */}
          <View className="flex flex-row mx-4 mt-[30%]">
            <TouchableOpacity
              className={`flex-1 items-center justify-center px-4 py-3 ${
                selectedOption === "personal"
                  ? "border-b-4 border-red-500"
                  : "border-b border-gray-300"
              }`}
              onPress={() => setSelectedOption("personal")}
            >
              <Text
                className={`text-xl ${
                  selectedOption === "personal"
                    ? "font-extrabold text-red-500"
                    : "text-gray-500"
                }`}
              >
                Personal Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 items-center justify-center px-4 py-3 ${
                selectedOption === "address"
                  ? "border-b-4 border-red-500"
                  : "border-b border-gray-300"
              }`}
              onPress={() => setSelectedOption("address")}
            >
              <Text
                className={`text-xl ${
                  selectedOption === "address"
                    ? "font-extrabold text-red-500"
                    : "text-gray-500"
                }`}
              >
                Address Details
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content Sections */}
          {selectedOption === "personal" && (
            <View className="mx-4 my-10">
              <DetailField
                label="Full Name"
                value={`${data?.first_name} ${data?.last_name}`}
              />
              <DetailField label="Employee Id" value={data?.Employee_id} />
              <DetailField
                label="Employe Of"
                value={data?.type?.toUpperCase()}
              />
            </View>
          )}

          {selectedOption === "address" && (
            <View className="mx-4 my-10">
              <DetailField label="Address" value={data?.address} />
              <DetailField label="District" value={data?.city_district} />
              <DetailField
                label="Pincode"
                value={String(Number(data?.pincode))}
              />
              <DetailField label="State" value={data?.state} />
              <DetailField label="Country" value="India" />
            </View>
          )}

          {/* Logout & Delete Buttons */}
          {selectedOption === "personal" && (
            <View className="flex-row justify-between gap-4 mt-6">
              <ActionButton
                text="Logout"
                backgroundColor="bg-gray-900"
                onPress={() => {
                  setIsLogout(true);
                  setIsModalVisible(true);
                }}
              />
              <ActionButton
                text="Delete Account"
                backgroundColor="bg-primaryColor"
                onPress={() => {
                  setIsLogout(false);
                  setIsModalVisible(true);
                }}
              />
            </View>
          )}

          <View className="flex items-center justify-center mt-6">
            <Text className="text-gray-700 text-sm py-4  font-medium">
              Made with{"  "}
              <Text className="font-bold text-red-700">❤</Text>
              {""} by {""}
              <Text className="font-bold text-primaryColor">Indian</Text>
            </Text>
          </View>
        </View>

        {/* Confirmation Modal */}
        <Modal visible={isModalVisible} transparent={true} animationType="fade">
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-lg w-4/5">
              <Text className="text-lg font-semibold text-gray-900">
                {isLogout
                  ? "Are you sure you want to logout?"
                  : "Are you sure you want to delete your account?"}
              </Text>
              <View className="flex-row justify-between gap-4 mt-6">
                <ActionButton
                  text="Cancel"
                  backgroundColor="bg-gray-300"
                  onPress={() => setIsModalVisible(false)}
                />
                <ActionButton
                  text={isLogout ? "Logout" : "Delete"}
                  backgroundColor={isLogout ? "bg-gray-900" : "bg-primaryColor"}
                  onPress={isLogout ? handleLogout : handleDelete}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* Loading & Error States */}
        {(loading || status === "loading") && <LoadingOverlay />}
        {err !== "" && <ErrorOverlay message={err} />}
      </View>
    </ScrollView>
  );
}

// Helper Components
const DetailField = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between border-b border-gray-300 py-4">
    <Text className="text-gray-700 text-md font-semibold">{label}</Text>
    <TextInput value={value} editable={false} className="text-gray-600" />
  </View>
);

const ActionButton = ({
  text,
  backgroundColor,
  onPress,
}: {
  text: string;
  backgroundColor: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 py-3 rounded-lg ${backgroundColor}`}
  >
    <Text className="text-center text-white font-semibold">{text}</Text>
  </TouchableOpacity>
);

const LoadingOverlay = () => (
  <View className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <ActivityIndicator size="large" color="#fff" />
  </View>
);

const ErrorOverlay = ({ message }: { message: string }) => (
  <View className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <Text className="text-white text-lg font-semibold">{message}</Text>
  </View>
);
