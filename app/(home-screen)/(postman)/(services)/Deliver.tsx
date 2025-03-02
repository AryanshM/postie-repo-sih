import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRouter } from "expo-router";
import api from "@/hooks/api/retrievToken";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Headers from "@/components/Headers";

const Deliver = () => {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [qrResult, setQrResult] = useState("");
  const [qrResultScanned, setQrResultScanned] = useState(false);
  const [successMessage, setSuccessMessage] = useState(new Animated.Value(0));
  const [cartonIds, setCartonId] = useState<string[]>([]);
  const data = useLocalSearchParams();
  const cartonId = data?.CartonId ? JSON.parse(data.CartonId as string) : null;

  const showSuccessMessage = () => {
    Animated.timing(successMessage, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(successMessage, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  const onBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (!scanningEnabled) return;
    setScanningEnabled(false);
    setQrResultScanned(false);
    setIsLoading(true);

    if (cartonIds.includes(data)) {
      Alert.alert("Duplicate", "This QR code has already been scanned.", [
        { text: "Scan Another", onPress: () => setScanningEnabled(true) },
      ]);
      setIsLoading(false);
      return;
    }

    const updatedCartonIds = [...cartonIds, data];
    setCartonId(updatedCartonIds);

    try {
      const response = await api.post("/employee/checkin/", {
        container_id: Number(data),
      });

      if (response.status === 200) {
        setQrResult(data);
        setQrResultScanned(true);
        showSuccessMessage();
      } else {
        Alert.alert("Error", "Failed to check in carton.", [
          { text: "OK", onPress: () => setScanningEnabled(true) },
        ]);
      }
    } catch (error: any) {
      const status = error.response?.status || "Unknown";
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unexpected error";

      Alert.alert("Error", ` ${message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setScanningEnabled(true);
      }, 2000);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Headers
          heading="Check-In Cartons"
          back={() =>
            router.replace("/(home-screen)/(postman)/(services)/Home")
          }
        />
        <Text className="text-2xl font-bold text-primaryColor mb-4">
          Cartons
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Camera access is required to scan QR codes.
        </Text>
        <TouchableOpacity
          className="bg-red-500 px-6 py-3 rounded-full shadow-lg"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold text-lg">
            Allow Camera Access
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-2xl font-bold text-red-600 mb-4">Cartons</Text>
        <Text className="text-gray-600 text-center mb-6">
          Please grant camera access to continue scanning.
        </Text>
        <TouchableOpacity
          className="bg-red-600 px-6 py-3 rounded-full shadow-lg"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold text-lg">Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-screenBackgroundColor px-4">
      <Headers
        heading="Deliver consignment"
        back={() => router.replace("/(home-screen)/(postman)/(tabs)/Home")}
      />

      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        className="bg-screenBackgroundColor flex-1 px-4 py-6"
      >
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Scan QR Code
        </Text>

        <CameraView
          style={{
            height: 300,
            width: "90%",
            borderRadius: 15,
            overflow: "hidden",
          }}
          onBarcodeScanned={onBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#007BFF" className="mt-4" />
        ) : (
          <Text
            className={`text-lg font-bold mt-4 ${
              qrResultScanned ? "text-green-600" : "text-gray-600"
            }`}
          >
            {qrResultScanned
              ? `Scanned QR: ${qrResult}`
              : "Place QR in front of the camera to scan."}
          </Text>
        )}

        <Animated.View
          style={{
            opacity: successMessage,
            transform: [{ scale: successMessage }],
          }}
          className="absolute top-7 w-4/5 mx-auto bg-green-100 border border-green-400 rounded-xl px-4 py-2 shadow-md"
        >
          <Text className="text-green-600 text-center font-bold">
            Successfully Scanned!!
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Deliver;
