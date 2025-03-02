import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import ProgreessConsigment from "@/components/ProgreessConsigment";
import InputField from "@/components/InputField";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import MovingButton from "@/components/MovingButton";
import {
  setfareDetails,
  setreceiverDetails,
} from "@/redux/slices/consignmentSlice";
import axios from "axios";

export default function ReceiverDetails() {
  const { width } = Dimensions.get("window");
  const isTablet = width > 600;
  const [loading, setLoading] = useState(false);
  const { data } = useSelector((state: any) => state.userData);

  const receiverDeteails = useSelector(
    (state: any) => state?.consignment?.receiverDetails,
  );

  const [receiverAddressDetails, setReceiverAddressDetails] = useState({
    phone_number: receiverDeteails?.phone_number || "",
    first_name: receiverDeteails?.first_name || "",
    last_name: receiverDeteails?.last_name || "",
    email: receiverDeteails?.email || "",
    state: receiverDeteails?.state || "",
    pincode: receiverDeteails?.pincode || "",
    country: "India",
    city_district: receiverDeteails?.city_district || "",
    address_details: receiverDeteails?.address_details || "",
  });

  console.log(receiverAddressDetails);

  const router = useRouter();
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

  useEffect(() => {
    dispatch(setreceiverDetails(receiverAddressDetails));
  }, [receiverAddressDetails, dispatch]);

  const moveToNext = async () => {
    if (
      !receiverAddressDetails.first_name ||
      !receiverAddressDetails.last_name ||
      !receiverAddressDetails.phone_number ||
      !receiverAddressDetails.address_details ||
      !receiverAddressDetails.city_district ||
      !receiverAddressDetails.country ||
      !receiverAddressDetails.email ||
      !receiverAddressDetails.pincode ||
      !receiverAddressDetails.state
    ) {
      Alert.alert("Error", "Please fill out all required fields.");
      return;
    }
    setLoading(true);
    if (!senderDetails || !receiverDetails || !articleDetails) {
      Alert.alert("Error", "Please fill out all required details.");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching fare details...");
      const url = "https://post.rootski.live";
      const response = await axios.post(`${url}/customer/calculatefare/`, {
        sender_pincode: senderDetails?.pincode,
        receiver_pincode: receiverDetails?.pincode,
        article_type: articleDetails?.type,
        service: articleDetails?.service,
        weight: Number(articleDetails?.weight),
      });

      if (response.status === 200) {
        const fare = response?.data;
        console.log("Fare Details:", fare);

        // Calculate delivery charges
        const deliveryCharges = fare.cost < 501 ? 20 : 0;

        const updatedFare = {
          cost: fare.cost,
          distance: fare.distance,
          deliveryCharge: deliveryCharges,
        };

        // Dispatch fare details
        dispatch(setfareDetails(updatedFare));
        setLoading(false);
        // Navigate to the next screen
        router.push("/(home-screen)/(spo)/(services)/(book-consigmnet)/ItemDetais");
      } else {
        Alert.alert("Error", "Unable to calculate fare. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Error fetching fare details:", error);
      setLoading(false);
    }
  };

  const handlePincodeChange = async (text: string) => {
    setReceiverAddressDetails((prev) => ({ ...prev, pincode: text }));

    if (text.length === 6) {
      setLoading(true);

      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${text}`,
        );
        const data = await response.json();

        if (data[0]?.PostOffice) {
          const [postOffice] = data[0].PostOffice;
          setReceiverAddressDetails((prev) => ({
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
        setReceiverAddressDetails((prev) => ({
          ...prev,
          city_district: "",
          state: "",
        }));
      } finally {
        setLoading(false);
      }
    }
  };
  const moveToBack = () => {
    router.push("/(home-screen)/(spo)/(services)/(book-consigmnet)/AddressDetails");
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 pb-2 bg-screenBackgroundColor px-4">
        {/* Header */}
        <ProgreessConsigment
          currentSteps={2}
          heading="Receiver Address Details"
          subheading="Please provide receiver details "
          handleBack={moveToBack}
        />

        {/* Receiver Details Card */}
        <View className="p-5 mb-5 mt-10 bg-white rounded-lg shadow-md">
          <Text className="font-semibold text-lg mb-4">Receiver Details</Text>

          {/* First and Last Name */}
          <View className="flex-row gap-4">
            <InputField
              className="flex-1"
              heading={"First Name"}
              value={receiverAddressDetails.first_name}
              onChangeText={(text: string) =>
                setReceiverAddressDetails({
                  ...receiverAddressDetails,
                  first_name: text,
                })
              }
              placeholder="Enter First Name"
            />
            <InputField
              className="flex-1"
              heading={"Last Name"}
              value={receiverAddressDetails.last_name}
              onChangeText={(text: string) =>
                setReceiverAddressDetails({
                  ...receiverAddressDetails,
                  last_name: text,
                })
              }
              placeholder="Enter Last Name"
            />
          </View>

          {/* Email */}
          <InputField
            className="mt-4"
            heading={"Email"}
            value={receiverAddressDetails.email}
            onChangeText={(text: string) =>
              setReceiverAddressDetails({
                ...receiverAddressDetails,
                email: text,
              })
            }
            placeholder="Enter Email"
          />

          {/* Phone Number */}
          <InputField
            className="mt-4"
            heading={"Phone Number"}
            value={receiverAddressDetails.phone_number}
            onChangeText={(text: string) =>
              setReceiverAddressDetails({
                ...receiverAddressDetails,
                phone_number: text,
              })
            }
            placeholder="Enter Phone Number"
          />
        </View>

        {/* Address Details Card */}
        <View className="p-5 mb-5 bg-white rounded-lg shadow-md">
          <Text className="font-semibold text-lg mb-4">Address Details</Text>

          {/* Address */}
          <InputField
            className="mt-4"
            heading={"Address"}
            value={receiverAddressDetails.address_details}
            onChangeText={(text: string) =>
              setReceiverAddressDetails({
                ...receiverAddressDetails,
                address_details: text,
              })
            }
            placeholder="Enter Address"
          />
          <InputField
            className="mt-4 "
            heading={"Pincode"}
            value={receiverAddressDetails.pincode}
            onChangeText={handlePincodeChange}
            placeholder="Enter Pincode"
          />

          {/* State and  */}
          <View className="flex-row gap-4">
            <InputField
              className="mt-4 flex-1"
              heading={"State"}
              value={receiverAddressDetails.state}
              placeholder="Enter State"
              editable={false}
            />

            <InputField
              className="mt-4 flex-1"
              heading={"District"}
              value={receiverAddressDetails.city_district}
              placeholder="Enter District"
              editable={false}
            />
          </View>

          {/* Country */}
          <InputField
            className="mt-4"
            heading={"Country"}
            value={receiverAddressDetails.country}
            onChangeText={(text: string) =>
              setReceiverAddressDetails({
                ...receiverAddressDetails,
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
