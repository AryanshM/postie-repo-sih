import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import ProgreessConsigment from "@/components/ProgreessConsigment";
import InputField from "@/components/InputField";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import MovingButton from "@/components/MovingButton";
import { setsenderDetails } from "@/redux/slices/consignmentSlice";

export default function AddressDetails() {
  const { width } = Dimensions.get("window");
  const isTablet = width > 600; // Check if the device is a tablet
  const [loading, setLoading] = useState(false);

  const senderDetails = useSelector(
    (state: any) => state?.consignment?.senderDetails,
  );
  console.log(senderDetails);

  const [addressDetails, setAddressDetails] = useState({
    phone_number: senderDetails?.phone_number || "",
    first_name: senderDetails?.first_name || "",
    last_name: senderDetails?.last_name || "",
    email: senderDetails?.email || "",
    state: senderDetails?.state || "",
    pincode: senderDetails?.pincode || "",
    country: "India",
    city_district: senderDetails?.city_district || "",
    address_details: senderDetails?.address_details || "",
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const moveToBack = () => {
    router.push("/(home-screen)/(nsh)/(services)/(book-consigmnet)/ArticleDetails");
  };

  const moveToNext = () => {
    if (
      !addressDetails.first_name ||
      !addressDetails.last_name ||
      !addressDetails.email ||
      !addressDetails.phone_number ||
      !addressDetails.address_details ||
      !addressDetails.city_district ||
      !addressDetails.state ||
      !addressDetails.pincode ||
      !addressDetails.country
    ) {
      alert("Please fill in all required details.");
      return;
    }
    dispatch(setsenderDetails(addressDetails));
    router.push("/(home-screen)/(nsh)/(services)/(book-consigmnet)/ReceiverDetails");
  };

  const handlePincodeChange = async (text: string) => {
    setAddressDetails((prev) => ({ ...prev, pincode: text }));

    if (text.length === 6) {
      setLoading(true);

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${text}`,
        );
        const data = await response.json();

        if (data[0]?.PostOffice) {
          const [postOffice] = data[0].PostOffice;
          setAddressDetails((prev) => ({
            ...prev,
            city_district: postOffice.District,
            state: postOffice.State,
          }));
        } else {
          throw new Error("Invalid Pincode");
        }
      } catch (error) {
        setLoading(false);
        alert("Invalid Pincode. Please try again.");
        setAddressDetails((prev) => ({
          ...prev,
          city_district: "",
          state: "",
        }));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-screenBackgroundColor px-4">
        {/* Header */}
        <ProgreessConsigment
          currentSteps={2}
          heading=" Sender Address Details"
          subheading="Please provide sender details"
          handleBack={moveToBack}
        />

        {/* Basic Details Card */}
        <View className="p-5 mt-8 mb-3 bg-white rounded-lg shadow-lg">
          <Text className="font-semibold text-lg mb-4">Basic Details</Text>
          <View className="flex-row gap-4">
            <InputField
              className="flex-1"
              heading={"First Name"}
              value={addressDetails.first_name}
              onChangeText={(text: string) =>
                setAddressDetails({ ...addressDetails, first_name: text })
              }
            />
            <InputField
              className="flex-1"
              heading={"Last Name"}
              value={addressDetails.last_name}
              onChangeText={(text: string) =>
                setAddressDetails({ ...addressDetails, last_name: text })
              }
            />
          </View>
        </View>

        {/* Contact Info Card */}
        <View className="p-5 mb-3 bg-white rounded-lg shadow-md">
          <Text className="font-semibold text-lg mb-4">
            Contact Information
          </Text>
          <InputField
            className="mb-4"
            heading={"Email"}
            value={addressDetails.email}
            onChangeText={(text: string) =>
              setAddressDetails({ ...addressDetails, email: text })
            }
          />
          <InputField
            className="mb-4"
            heading={"Phone Number"}
            value={addressDetails.phone_number}
            onChangeText={(text: string) =>
              setAddressDetails({ ...addressDetails, phone_number: text })
            }
          />
        </View>

        {/* Address Details Card */}
        <View className="p-5 mb-5 bg-white rounded-lg shadow-md">
          <Text className="font-semibold text-lg mb-4">Address Details</Text>
          <InputField
            className="mb-4"
            heading={"Address"}
            value={addressDetails.address_details}
            onChangeText={(text: string) =>
              setAddressDetails({ ...addressDetails, address_details: text })
            }
          />
          <InputField
            className="mt-4 "
            heading={"Pincode"}
            value={addressDetails.pincode}
            onChangeText={handlePincodeChange}
            placeholder="Enter Pincode"
          />

          {/* State and  */}
          <View className="flex-row gap-4">
            <InputField
              className="mt-4 flex-1"
              heading={"State"}
              value={addressDetails.state}
              placeholder="Enter State"
              editable={false}
            />

            <InputField
              className="mt-4 flex-1"
              heading={"District"}
              value={addressDetails.city_district}
              placeholder="Enter District"
              editable={false}
            />
          </View>

          {/* Country */}
          <InputField
            className="mt-4"
            heading={"Country"}
            value={addressDetails.country}
            onChangeText={(text: string) =>
              setAddressDetails({
                ...addressDetails,
                country: text,
              })
            }
            editable={false}
            placeholder="Enter Country"
          />
        </View>
        {/* Loading Indicator */}
        {loading && (
          <View className="flex justify-center items-center mt-4">
            <ActivityIndicator size="large" color="#333" />
          </View>
        )}

        {/* Action Buttons */}
        <MovingButton moveToBack={moveToBack} moveToNext={moveToNext} />
      </View>
    </ScrollView>
  );
}
