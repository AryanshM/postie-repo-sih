import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Print from "expo-print";
import { useLocalSearchParams } from "expo-router";
import api from "@/hooks/api/retrievToken";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
const Next = () => {
  const val = useLocalSearchParams();
  const cartonId = JSON.parse(val.container_id as string);
  const [loading, setLoading] = useState(false);
  const [data1, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.post("/employee/get_container_details/", {
          container_id: Number(cartonId),
        });
        if (res.status === 200) {
          setData(res?.data);
        }
      } catch (error: any) {
        Alert.alert("Error", "Error while fetching Carton Details");
        console.log(
          "Error in container detail screen (Next.tsx)",
          error.message,
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle print functionality
  const printDocument = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              line-height: 1.6;
            }
            .container {
              margin: 20px;
              padding: 10px;
              background-color: #f4f4f4;
              border-radius: 8px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              color: #333;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
            }
            .section {
              margin-bottom: 20px;
            }
            .qr-codes {
              display: flex;
              justify-content: space-between;
            }
            .qr-codes img {
              width: 100px;
              height: 100px;
              border-radius: 8px;
            }
            .consignment {
              background-color: #fff;
              padding: 10px;
              border-radius: 8px;
              margin-top: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .consignment-header {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="title">Container Details</div>
              <div class="subtitle">Container ID: ${data1?.container_id}</div>
              <div class="subtitle">Created At: ${new Date(data1?.created_at).toLocaleString()}</div>
              <div class="subtitle">Going To: ${data1?.going_to}</div>
            </div>

            <div class="section">
              <div class="title">QR Codes</div>
              <div class="qr-codes">
                <div>
                  <div>Barcode</div>
                  <img src="${data1?.qr?.barcode_url}" />
                </div>
                <div>
                  <div>QR Code</div>
                  <img src="${data1?.qr?.qr_url}" />
                </div>
              </div>
            </div>

            <div class="section">
              <div class="title">Consignment Details</div>
              ${data1?.consignments
                .map(
                  (consignment: any) => `
                    <div class="consignment">
                      <div class="consignment-header">Consignment ID: ${consignment.consignment_id}</div>
                      <div>Type: ${consignment.type}</div>
                      <div>Service: ${consignment.service}</div>
                    </div>
                  `,
                )
                .join("")}
            </div>
            <div class="footer">
              <div class="button" onclick="window.print();">Print this Document</div>
            </div>
          </div>
        </body>
      </html>
    `;
    try {
      await Print.printAsync({ html: htmlContent });
    } catch (error) {
      console.error("Error printing QR Code", error);
      Alert.alert("Error", "Failed to print the QR Code.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!data1) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] p-4">
      {/* Header */}
      <View className="flex flex-row justify-between">
        <View className="flex-row items-center my-6">
          <TouchableOpacity
            onPress={() => router.replace("/(home-screen)/(hpo)/(tabs)/Home")}
            className="p-2 bg-[#ECECEC] rounded-full"
          >
            <Ionicons name="arrow-back-outline" size={26} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Carton Detail</Text>
        </View>

        <TouchableOpacity
          onPress={printDocument}
          className="my-6 py-3 px-6 bg-primaryColor rounded-md shadow-lg"
        >
          <Text className="text-screenBackgroundColor">Print</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white p-6 rounded-lg shadow-md mb-6">
        <View className="flex flex-row justify-between">
          <Text className="text-2xl flex-1 font-bold text-[#333] mb-2">
            Container Details
          </Text>
        </View>
        <Text className="text-sm text-[#777] mb-1">
          Container ID: {data1.container_id}
        </Text>
        <Text className="text-sm text-[#777] mb-1">
          Created At: {new Date(data1.created_at).toLocaleString()}
        </Text>
        <Text className="text-sm text-[#777]">Going To: {data1.going_to}</Text>
      </View>

      {/* QR Codes Section */}
      <View className="bg-white p-4 rounded-lg shadow-md mb-6">
        <Text className="text-lg font-semibold text-[#333] mb-4">QR Codes</Text>
        <View className="flex-row justify-between mx-2">
          <View className="items-center">
            <Text className="text-sm text-[#555] mb-2">Barcode</Text>
            <Image
              source={{ uri: data1.qr?.barcode_url }}
              className="w-28 h-28 rounded-lg mb-4"
            />
          </View>
          <View className="items-center">
            <Text className="text-sm text-[#555] mb-2">QR Code</Text>
            <Image
              source={{ uri: data1.qr?.qr_url }}
              className="w-28 h-28 rounded-lg mb-4"
            />
          </View>
        </View>
      </View>

      {/* Consignments List */}
      <View className="bg-white p-6 rounded-lg shadow-md">
        <Text className="text-lg font-semibold text-[#333] mb-4">
          Consignments
        </Text>
        {data1.consignments.map((consignment: any) => (
          <View
            key={consignment.consignment_id}
            className="bg-[#F8F8F8] p-4 mb-4 rounded-lg shadow-sm"
          >
            <Text className="text-sm font-semibold text-[#333] mb-1">
              Consignment ID: {consignment.consignment_id}
            </Text>
            <Text className="text-sm text-[#777]">
              Type: {consignment.type}
            </Text>
            <Text className="text-sm text-[#777]">
              Service: {consignment.service}
            </Text>
          </View>
        ))}
      </View>

      {/* Print Button
      <TouchableOpacity
        className="bg-primaryColor absolute -bottom-8 right-3 items-center py-2 px-6 rounded-md self-center"
        onPress={printDocument}
      >
        <Text className="text-white text-lg font-semibold">Print Container Details</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

export default Next;
