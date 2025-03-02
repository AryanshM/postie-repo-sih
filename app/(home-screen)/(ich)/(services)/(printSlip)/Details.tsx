import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import InputField from "@/components/InputField";
import { useLocalSearchParams } from "expo-router";
import * as Print from "expo-print";
import api from "@/hooks/api/retrievToken";

const Details = () => {
  const [editMode, setEditMode] = useState<"sender" | "receiver" | null>(
    "sender",
  );
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);
  const [editables, setEditables] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(false);

  const router = useRouter();

  // Parsing incoming data safely
  const data = useLocalSearchParams();

  const order = (() => {
    try {
      return JSON.parse(data.order as string);
    } catch {
      return null;
    }
  })();

  const senderDetail = (() => {
    try {
      return JSON.parse(data.sender_details as string);
    } catch {
      return {};
    }
  })();

  const receiverDetail = (() => {
    try {
      return JSON.parse(data.receiver_details as string);
    } catch {
      return {};
    }
  })();

  const qrLink = (() => {
    try {
      return JSON.parse(data.qrCode as string);
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (qrLink === null) {
      setQrCode(null);
      setQrCodeGenerated(false);
    } else {
      setQrCode(qrLink);
      setQrCodeGenerated(true);
    }
  }, [qrLink]);

  const handleGenerateQR = async () => {
    setLoadingQR(true);
    try {
      const response = await api.post("/employee/generate_qr/", {
        consignment_id: order?.consignment_id,
      });
      if (response.status === 200) {
        console.log("QR Code Generated");

        setQrCode(response?.data.urls.qr_code_url);
        setQrCodeGenerated(true);
      } else {
        console.log("Error in Details handleGenerateQR", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "QR Code Generation Failed");
      if (error instanceof Error) {
        console.log("Error in Details handleGenerateQR", error.message);
      } else {
        console.log("Error in Details handleGenerateQR", error);
      }
    } finally {
      setLoadingQR(false);
    }
  };

  const handlePrint = async () => {
    if (!qrCode) {
      Alert.alert("Error", "No QR Code available to print.");
      return;
    }

    const html = `
    <div style="width: 100%; height: 100%; font-family: Arial, sans-serif; padding: 40px; box-sizing: border-box;">
      <div style="border: 2px solid #000; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; text-align: center;">
        <h1 style="font-size: 24px; margin-bottom: 20px;">Consignment QR Code</h1>
        <img src="${qrCode}" style="width: 300px; height: 300px; margin-bottom: 20px;" alt="QR Code" />
        <p style="font-size: 16px; margin: 10px 0;">Consignment ID:</p>
        <p style="font-size: 20px; font-weight: bold; margin: 10px 0;">${order?.consignment_id || "N/A"}</p>
        <p style="font-size: 12px; color: #555; margin-top: 20px;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  `;

    try {
      await Print.printAsync({ html });
    } catch (error) {
      console.error("Error printing QR Code", error);
      Alert.alert("Error", "Failed to print the QR Code.");
    }
  };

  const [senderDetails, setSenderDetails] = useState(senderDetail);
  const [receiverDetails, setReceiverDetails] = useState(receiverDetail);

  return (
    <View className="flex-1 bg-screenBackgroundColor p-4">
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.replace("/(home-screen)/(ich)/(tabs)/Home")}
            className="p-2 bg-[#ECECEC] rounded-full"
          >
            <Ionicons name="arrow-back-outline" size={26} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">
            Details of Consignment
          </Text>
        </View>

        {/* QR Code Section */}
        <View className="flex items-center mb-6">
          <TouchableOpacity
            onPress={handleGenerateQR}
            className="w-[230px] h-[230px] bg-white shadow-md rounded-lg flex items-center justify-center"
          >
            {qrCodeGenerated ? (
              <Image
                source={{ uri: qrCode || "" }}
                className="w-56 h-56"
                resizeMode="contain"
              />
            ) : (
              <Text className="text-lg text-center">
                {loadingQR ? "Generating QR Code..." : "Generate QR Code"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Print Button */}
          {qrCodeGenerated && (
            <TouchableOpacity
              onPress={handlePrint}
              className="mt-4 bg-red-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-bold">
                Print QR Code
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs for Sender and Receiver */}
        <View className="flex-row justify-evenly mb-4">
          <TouchableOpacity
            onPress={() => setEditMode("sender")}
            className={`py-3 px-6 rounded-lg  ${
              editMode === "sender"
                ? " border-b text-red-600 border-b-red-600"
                : " "
            }`}
          >
            <Text
              className={` font-semibold ${
                editMode === "sender" ? "  text-red-500 " : "text-gray-900"
              }`}
            >
              Sender Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEditMode("receiver")}
            className={`py-3 px-6 rounded-lg  ${
              editMode === "receiver" ? " border-b  border-b-red-600" : ""
            }`}
          >
            <Text
              className={` font-semibold ${
                editMode === "receiver" ? "  text-red-500 " : "text-gray-900"
              }`}
            >
              Receiver Details
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Details Section */}
        <View className="bg-white p-4 my-3 rounded-lg shadow-md">
          <Text className="font-semibold text-lg mb-4">Basic Details</Text>
          <View className="flex-row gap-4 mb-4">
            <InputField
              className="flex-1"
              heading="First Name"
              value={
                editMode === "sender"
                  ? senderDetails.first_name
                  : receiverDetails.first_name
              }
              onChangeText={(text) =>
                editMode === "sender"
                  ? setSenderDetails({ ...senderDetails, first_name: text })
                  : setReceiverDetails({ ...receiverDetails, first_name: text })
              }
              editable={editables}
            />
            <InputField
              className="flex-1"
              heading="Last Name"
              value={
                editMode === "sender"
                  ? senderDetails.last_name
                  : receiverDetails.last_name
              }
              onChangeText={(text) =>
                editMode === "sender"
                  ? setSenderDetails({ ...senderDetails, last_name: text })
                  : setReceiverDetails({ ...receiverDetails, last_name: text })
              }
              editable={editables}
            />
          </View>

          <InputField
            className="mb-4"
            heading="Phone Number"
            value={
              editMode === "sender"
                ? senderDetails.phone_number
                : receiverDetails.phone_number
            }
            onChangeText={(text) =>
              editMode === "sender"
                ? setSenderDetails({ ...senderDetails, phone_number: text })
                : setReceiverDetails({ ...receiverDetails, phone_number: text })
            }
            editable={editables}
            keyboardType="numeric"
          />
        </View>
        <View className="bg-white p-4 my-4 rounded-lg shadow-md">
          <Text className="font-semibold text-lg mb-4">Address Details</Text>
          <InputField
            heading="Address"
            value={
              editMode === "sender"
                ? senderDetails.address
                : receiverDetails.address
            }
            onChangeText={(text) =>
              editMode === "sender"
                ? setSenderDetails({ ...senderDetails, address: text })
                : setReceiverDetails({ ...receiverDetails, address: text })
            }
            editable={editables}
          />
          <InputField
            className="mt-4"
            heading="City/District"
            value={
              editMode === "sender"
                ? senderDetails.city_district
                : receiverDetails.city_district
            }
            onChangeText={(text) =>
              editMode === "sender"
                ? setSenderDetails({ ...senderDetails, city_district: text })
                : setReceiverDetails({
                    ...receiverDetails,
                    city_district: text,
                  })
            }
            editable={editables}
          />

          <View className="flex-row gap-4 space-x-4 mt-4">
            <InputField
              className="flex-1"
              heading="State"
              value={
                editMode === "sender"
                  ? senderDetails.state
                  : receiverDetails.state
              }
              onChangeText={(text) =>
                editMode === "sender"
                  ? setSenderDetails({ ...senderDetails, state: text })
                  : setReceiverDetails({ ...receiverDetails, state: text })
              }
              editable={editables}
            />
            <InputField
              className="flex-1"
              heading="Pincode"
              value={
                editMode === "sender"
                  ? String(senderDetails.pincode)
                  : String(receiverDetails.pincode)
              }
              onChangeText={(text) =>
                editMode === "sender"
                  ? setSenderDetails({ ...senderDetails, pincode: text })
                  : setReceiverDetails({ ...receiverDetails, pincode: text })
              }
              editable={editables}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      {/* Save/Edit Button */}
      <View className="absolute bottom-4 right-4">
        <TouchableOpacity
          onPress={() => setEditables(!editables)}
          className="bg-red-500 px-8 py-3 rounded-lg"
        >
          <Text
            className="text-white text-center"
            style={{ fontFamily: "PoppinsBold" }}
          >
            {editables ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Details;
