import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
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
import { useFonts } from "expo-font";
import CartonCard from "@/components/CartonCard";

export default function Scan() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanningEnabled, setScanningEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [qrResult, setqrResult] = useState("");
  const [qrResultScanned, setqrResultScanned] = useState(false);
  interface Consignment {
    consignment_id: string;
    type: string;
    service: string;
  }

  const [consignmentDetails, setConsignmentDetails] = useState<Consignment[]>(
    []
  );
  const [cartonIds, setCartonId] = useState<string[]>([]);
  const data = useLocalSearchParams();
  const cartonId = JSON.parse(data?.CartonId as string);
  const [loadingNext , setNextLoading] = useState(false)

  useEffect(() => {
    const fetchConsignmentDetails = async () => {
      try {
        const response = await api.post("/employee/get_container_details/", {
          container_id: Number(cartonId),
        });

        if (response.status === 200) {
          setConsignmentDetails(response.data.consignments || []);
        } else {
          Alert.alert("Error", "Failed to fetch consignment data.");
        }
      } catch (error: any) {
        console.error("Error in fetching consignment details:", error.response);
        Alert.alert("Error", `Request failed with status: ${error.response.status} - ${error.response.data.message || error.response.data}`);
      }
    };

    fetchConsignmentDetails();
  }, []);

  const onBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (!scanningEnabled) return;
    setScanningEnabled(false);
    setqrResultScanned(false);
    setIsLoading(true);
  
    if (cartonIds.includes(data)) {
      Alert.alert("Duplicate", "This QR code has already been scanned.", [
        { text: "Scan Another", onPress: () => setScanningEnabled(true) },
      ]);
      setIsLoading(false);
      return;
    }
  
    setCartonId((prev) => [...prev, data]);
    console.log("ConId", data);
    console.log("Container ", cartonId);
  
    try {
      const response = await api.post("/employee/relate_consignment_container/", {
        consignment_id: Number(data),
        container_id: Number(cartonId),
      });
  
      if (response.status === 200) {
        const res = await api.post("/employee/get_container_details/", {
          container_id: Number(cartonId),
        });
  
        if (res.status === 200) {
          setConsignmentDetails(res.data.consignments || []);
          setqrResultScanned(true);
          setqrResult(data);
        } else {
          Alert.alert("Error", "Failed to fetch consignment data.");
        }
      } else {
        Alert.alert("Error", "Failed to associate consignment with the container.");
      }
    } catch (error: any) {
      console.log("Error in uploading consignment details:", error);
        console.error("Error Response:", error.response.data.error);
        Alert.alert("Error", `Request failed with status: ${error.response.status} - ${error.response.data.message || error.response.data}`);
      
    } finally {
      
      setIsLoading(false);
      setTimeout(()=>{
        setScanningEnabled(true);
      },2000)
    }
  };
  

  const handleDelete = (consignmentID: number) =>{
    Alert.alert("Delete","Are you sure you want to delete this consignment?",[
      {
        text:"Cancel",
        onPress:()=>{}
      },
      {
        text:"Delete",
        onPress: async()=>{
          try {
            const res = await api.post("/employee/remove_consignment_container/",{
              consignment_id:consignmentID,
              container_id:Number(cartonId)
            })
            if(res.status===200){
              const response = await api.post("/employee/get_container_details/", {
                container_id: Number(cartonId),
              });
              if (response.status === 200) {
                setConsignmentDetails(response.data.consignments || []);
              } else {
                Alert.alert("Error", "Failed to fetch consignment data.");
              }
            }
          } catch (error :any) {
            console.log("Error in deleting consignment", error.response);
            Alert.alert("Error","Error in deleting consignment")
          }
        }
      }
    ])
  }

  const handleNext = async()=>{
    setNextLoading(true)
      try {
        const res = await api.post("/employee/generate_container_qr/",{
          "container_id":Number(cartonId)
        })
        console.log(res?.data?.urls?.qr_code_url)
        if(res.status===200){
          router.replace({
            pathname:"/(home-screen)/(hpo)/(services)/(create-carton)/Next",
            params:{
              container_id : JSON.stringify(cartonId),
              url : JSON.stringify(res?.data?.urls?.qr_code_url)
            }
          })
        }
      } catch (error :any) {
        Alert.alert("Error","Error in Generating QR code",[{
           text: "OK", onPress: () => setNextLoading(false) 
        }])
        console.log("Error in generating consignment QR code", error.response);
      }finally{
        setNextLoading(false)
      }
  }
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-6">
        <Text className="text-3xl font-bold text-red-600 mb-4">Cartons</Text>
        <Text className="text-gray-600 text-center mb-6">
          Camera access is required to scan QR codes.
        </Text>
        <TouchableOpacity
          className="bg-primaryColor px-6 py-3 rounded-md"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-lg">
            Allow Camera Access
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-6">
        <Text className="text-3xl font-bold text-red-600 mb-4">Cartons</Text>
        <Text className="text-gray-600 text-center mb-6">
          Please grant camera access to continue scanning.
        </Text>
        <TouchableOpacity
          className="bg-red-600 px-6 py-3 rounded-md"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold text-lg">Grant Access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F8FAFC] px-4">
      {/* Header */}
      <View className="flex-row items-center mt-6">
        <TouchableOpacity
          onPress={() => router.replace("/(home-screen)/(hpo)/(services)/(create-carton)/Create")}
          className="p-2 bg-[#ECECEC] rounded-full"
        >
          <Ionicons name="arrow-back-outline" size={26} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">Consignment Scan</Text>
        {/* Next Button */}
        <View style={{ position: "absolute", right: 20 }} className="shadow-lg">
          <TouchableOpacity disabled={loadingNext} onPress={handleNext}>
            <View>
              <Text className="text-primaryColor font-semiBold text-xl">
                {loadingNext ? "Loading.." : "Next"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        className="bg-gray-50 flex-1 px-4 py-6"
      >
        {/* Camera */}
        <Text className="text-xl font-bold text-gray-800 mb-4">Scan QR Code</Text>
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

        {/* Scanned Consignment Details */}
        <View className="mt-6 w-full">
          <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
            Consignment Details
          </Text>
          {consignmentDetails.length > 0 ? (
            consignmentDetails.map((consignment, index) => (
              <View
                key={index}
                className="bg-white flex flex-row justify-between items-center rounded-lg p-4 mb-3 shadow-md"
              >
                <View className="flex-1">
                  <Text className="text-gray-950 font-bold">
                    Consignment ID: {consignment.consignment_id}
                  </Text>
                  <Text className="text-gray-500">Type: {consignment.type}</Text>
                  <Text className="text-gray-500">Service: {consignment.service}</Text>
                </View>
                <TouchableOpacity
                  className="bg-primaryColor px-5 py-3 rounded-md"
                  onPress={() => handleDelete(Number(consignment.consignment_id))}
                >
                  <Text className="text-white font-semibold text-base">Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center">No consignments scanned yet.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
