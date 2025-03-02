import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "@/hooks/api/retrievToken";
import Headers from "@/components/Headers";
import { images } from "@/constants";
import { ActivityIndicator } from "react-native-paper";

const width = Dimensions.get("window").width;

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [todayContainers, setTodayContainers] = useState<Container[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const router = useRouter();
  const isTablet = width > 600;
  const [qr, setQr] = useState<string | null>(null);


  useEffect(() => {
    const fetchTodayContainers = async () => {
      setContentLoading(true);
      try {
        const response = await api.get("/employee/get_todays_container/");
        if (response.status === 200) {
          setTodayContainers(response?.data);
        }
      } catch (error: any) {
        Alert.alert("Error", "Error while fetching today's containers");
      } finally {
        setContentLoading(false);
      }
    };
    fetchTodayContainers();
  }, []);

  
  interface Container {
    container_id: number;
    created_at: string;
    going_to: string;
    consignments: any[];
    qr?: {
      qr_url?: string;
    };
  }

  const openCarton = async (cartonId: number) => {
    router.push({
      pathname: "/(home-screen)/(nsh)/(services)/(create-carton)/Scan",
      params: {
        CartonId: JSON.stringify(cartonId),
      },
  });
  }
 

  // Render each carton card
  const renderTodayCartons = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        openCarton(item.container_id);
      }}
    >
    <View
      className={`${
        isTablet ? "w-72 h-[40%]" : "w-52  h-[45%]"
      } bg-white p-4 m-2 rounded-lg shadow-md`}
    >
      {/* QR Image */}
      {item?.qr?.qr_url ? (<Image
        source={{ uri: item?.qr?.qr_url }}
        className="w-full h-36 rounded-md mb-4"
        resizeMode="contain"
      />):(
        <>
        <View className="w-full h-36 flex items-center justify-center bg-screenBackgroundColor rounded-md mb-4" >
        <Text className="text-center font-bold items-center flex  justify-center text-gray-500">No QR Code</Text>
        </View>
        </>
        
      )}
      
      {/* Card Content */}
      <View>
        <Text className="text-lg font-bold text-gray-800 text-center">
          Carton ID: {item.container_id}
        </Text>
        <Text className="text-sm text-gray-600 text-center mt-1">
          Created At: {new Date(item.created_at).toLocaleString()}
        </Text>
        <Text className="text-sm text-gray-600 text-center mt-1">
          Going To: {item.going_to}
        </Text>
        <Text className="text-sm text-gray-600 text-center mt-1">
          Consignments: {item.consignments.length}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
  );

  const handleCreateCartonScreen = async () => {
    setLoading(true);
    try {
      const response = await api.post("/employee/create_container/");
      if (response.status === 200) {
        router.push({
          pathname: "/(home-screen)/(nsh)/(services)/(create-carton)/Scan",
          params: {
            CartonId: JSON.stringify(response?.data?.container_id),
          },
        });
      }
    } catch (error: any) {
      Alert.alert("Error", "Error in creating Carton");
    } finally {
      setLoading(false);
    }
  };

  if (contentLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 p-6">
        <Text className="text-gray-600 text-center mb-6">
          Loading cartons{" "}
          <ActivityIndicator size="small" color="#333" />
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-4">
      {/* Header */}
      <Headers heading="Create Carton" back={() => router.push("/(home-screen)/(nsh)/(tabs)/Home")} />

      {/* Search Bar */}
      <View
        className="flex-row items-center mt-6 px-4 py-2 mb-6 bg-white rounded-xl shadow-sm"
      >
        <Ionicons name="search-outline" size={22} color="#999" />
        <TextInput
          className="flex-1 text-base text-gray-700 ml-2"
          placeholder="Search cartons by ID"
          placeholderTextColor="#999"
        />
      </View>

      {/* Illustration and Info */}
      {todayContainers.length === 0 && (
        <View className="items-center mb-8">
          <Text className="text-lg font-medium text-center mb-2">
            Easily create new cartons
          </Text>
          <Text className="text-sm text-center text-gray-500 mb-4 px-4">
            Click the button below to create a new carton for today’s
            consignment.
          </Text>
          <Image
            source={images.createIllustration}
            className="w-full h-56"
            resizeMode="contain"
          />
        </View>
      )}

      {/* Horizontal Scrollable Cartons List */}
      {todayContainers.length > 0 && (
        <>
          <Text className="text-2xl font-semibold text-center mb-4">
            Today's Cartons
          </Text>
          <FlatList
            data={todayContainers}
            keyExtractor={(item) => item.container_id.toString()}
            renderItem={renderTodayCartons}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 16 }}
          />
        </>
      )}

      {/* Create Carton Button */}
      <TouchableOpacity
        onPress={handleCreateCartonScreen}
        className="absolute bottom-8 left-6 right-6 bg-primaryColor py-4 rounded-xl shadow-lg"
      >
        <Text className="text-white text-center text-lg">
          {loading ? "Creating Carton ..." : "+ Create New Carton"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Create;
