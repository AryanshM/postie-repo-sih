import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import ProgreessConsigment from "@/components/ProgreessConsigment";
import { useDispatch, useSelector } from "react-redux";
import api from "@/hooks/api/retrievToken";
import { useRouter } from "expo-router";
import { clearDetails } from "@/redux/slices/consignmentSlice";

export default function Pay() {
  const [selectedPayment, setSelectedPayment] = useState("credit"); // State for selected payment method
  const dispatch = useDispatch();
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

  const router = useRouter();

  const handlePayment = async () => {
    try {
      const requestBody: any = {
        type: articleDetails?.type,
        Amount: fareDetails?.cost + fareDetails?.deliveryCharge,
        is_payed: true,
        payment_method: selectedPayment,
        service: articleDetails?.service,
        sender: {
          first_name: senderDetails?.first_name,
          last_name: senderDetails?.last_name,
          pincode: Number(senderDetails?.pincode),
          address: senderDetails?.address_details,
          city_district: senderDetails?.city_district,
          state: senderDetails?.state,
          country: senderDetails?.country,
          phone_number: Number(senderDetails?.phone_number),
        },
        receiver: {
          first_name: receiverDetails?.first_name,
          last_name: receiverDetails?.last_name,
          pincode: Number(receiverDetails?.pincode),
          address: receiverDetails?.address_details,
          city_district: receiverDetails?.city_district,
          state: receiverDetails?.state,
          country: receiverDetails?.country,
          phone_number: Number(receiverDetails?.phone_number),
        },
      };

      if (articleDetails?.type === "parcel") {
        requestBody.parcel = {
          weight: articleDetails?.weight,
          length: articleDetails?.length,
          breadth: articleDetails?.width,
          height: articleDetails?.height,
          price: fareDetails?.cost,
        };
      }

      const response = await api.post(
        "/employee/book_consignment_hpo/",
        requestBody,
      );
      if (response.status === 200) {
        dispatch(clearDetails());
        Alert.alert(
          "Payment Successful",
          "Your payment was completed successfully!",
        );
        router.push("/(home-screen)/(ich)/(services)/(book-consigmnet)/Completion");
      } else {
        Alert.alert("Payment Failed", "Please try again later.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      Alert.alert("Error", "Unable to complete payment. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-white">
      {/* Header Section */}
      <ProgreessConsigment
        currentSteps={5}
        heading="Complete Your Payment"
        subheading="A few steps away from dispatching your parcel!"
        handleBack={() =>
          router.push("/(home-screen)/(nsh)/(services)/(book-consigmnet)/ItemDetais")
        }
      />

      {/* Payment Summary */}
      <View className="px-4 pt-10 pb-6">
        <View className="bg-white shadow-lg rounded-lg p-6">
          <Text className="text-lg font-bold text-primaryColor mb-4">
            Payment Summary
          </Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-base text-gray-700">Item Charges:</Text>
            <Text className="text-base font-medium text-gray-700">
              ₹{fareDetails?.cost}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-base text-gray-700">Pickup Charges:</Text>
            <Text className="text-base font-medium text-gray-700">
              ₹{fareDetails?.deliveryCharge || 0}
            </Text>
          </View>
          <View className="border-t border-gray-200 my-2" />
          <View className="flex-row justify-between">
            <Text className="text-xl font-bold text-gray-900">Total:</Text>
            <Text className="text-xl font-bold text-primaryColor">
              ₹{(fareDetails?.deliveryCharge || 0) + fareDetails?.cost}
            </Text>
          </View>
        </View>
      </View>

      {/* Payment Options */}
      <View className="px-4 mt-4">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Select Payment Method
        </Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            className={`flex-1 bg-white border ${
              selectedPayment === "credit"
                ? "border-primaryColor"
                : "border-gray-200"
            } rounded-lg shadow-md p-4 items-center mx-1`}
            onPress={() => setSelectedPayment("credit")}
          >
            <FontAwesome5 name="credit-card" size={24} color="#4CAF50" />
            <Text className="mt-2 text-gray-700 font-medium">Credit Card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 bg-white border ${
              selectedPayment === "upi"
                ? "border-primaryColor"
                : "border-gray-200"
            } rounded-lg shadow-md p-4 items-center mx-1`}
            onPress={() => setSelectedPayment("upi")}
          >
            <FontAwesome name="rupee" size={24} color="#FF5722" />

            <Text className="mt-2 text-gray-700 font-medium">UPI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 bg-white border ${
              selectedPayment === "cash"
                ? "border-primaryColor"
                : "border-gray-200"
            } rounded-lg shadow-md p-4 items-center mx-1`}
            onPress={() => setSelectedPayment("cash")}
          >
            <MaterialIcons name="money" size={24} color="#FFC107" />
            <Text className="mt-2 text-gray-700 font-medium">Cash</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pay Now Button */}
      <View className="px-4 py-8">
        <TouchableOpacity
          className="bg-primaryColor py-3 rounded-xl shadow-md flex-row justify-center items-center"
          activeOpacity={0.9}
          onPress={handlePayment}
        >
          <MaterialIcons name="payment" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Pay Now</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="bg-gray-50 py-4 items-center">
        <Text className="text-sm text-gray-500 text-center px-4">
          By proceeding, you agree to our{" "}
          <Text className="text-primaryColor font-medium">
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text className="text-primaryColor font-medium">Privacy Policy</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}
