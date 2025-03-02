import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { icons } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import CartonCard from "@/components/CartonCard";
import Headers from "@/components/Headers";
import api from "@/hooks/api/retrievToken";

const CheckIn = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  const[loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCartons = async () => {
      setLoading(true);
      try {
        const response = await api.get("/employee/get_checkout_container/");
        if (response.status === 200) {
          setData(response?.data);
          setFilteredCartons(response.data);
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.response?.data?.error || "Unexpected error";
  
        Alert.alert("Error", ` ${message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchCartons();
  }, []);

  
  const [filtered, setFilteredCartons] = useState(data);
  const handleSearch = (text: any) => {
    setSearch(text);

    if (text.trim() === "") {
      setFilteredCartons(data);
    } else {
      const filtered = data.filter(
        (carton) =>
          carton?.container?.going_to
            ?.toLowerCase()
            .includes(text.toLowerCase()) ||
          new Date(carton?.container?.created_at)
            .toLocaleString("en-US")
            .includes(text.toLowerCase()) 
      );
      setFilteredCartons(filtered);
    }
  };

  if(loading){
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-screenBackgroundColor px-4">
      {/* Header */}
      <Headers heading="Check-Out Cartons" back={() => router.replace("/(home-screen)/(spo)/(tabs)/Home")} />

      {/* Search Bar */}
      <View className="flex-row items-center gap-2 bg-white mt-6 py-1 px-2 rounded-md shadow-sm">
        <Ionicons name="search-outline" size={22} color="#999" />
        <TextInput
          placeholder="Search cartons by Destination"
          placeholderTextColor="#999"
          className="flex-1 text-gray-700"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* Illustration and Scan Button */}
      <View className="items-center my-8">
        <TouchableOpacity
          onPress={() => router.replace("/(home-screen)/(spo)/(services)/(check-out)/ScanHPO")}
          className="h-24 w-24 bg-white rounded-full shadow-xl items-center justify-center"
        >
          <Image
            source={icons.checkInIcon}
            style={{ width: "70%", height: "70%", resizeMode: "contain" }}
          />
        </TouchableOpacity>
        <Text className="text-lg mt-3 text-gray-600">Tap to Scan Cartons</Text>
      </View>
      
        {filtered.length === 0 ? (
          <>
          <View className="flex-1 items-center mt-8 mx-8 ">
         
        
          {/* Add spacing and improved text */}
          <Text className="text-gray-700 text-lg font-semibold ">
            No cartons found
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Try adjusting your search or adding new cartons to view them here.
          </Text>
        
          
        </View>
        <TouchableOpacity
        onPress={() => {
          router.replace("/(home-screen)/(spo)/(services)/(check-out)/ScanHPO");
        }}
        className="absolute bottom-10 left-6 right-6 bg-[#CD3431] py-4 rounded-lg"
        style={{
          shadowColor: "#CD3431",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <Text
          className="text-white text-center text-lg"
          
        >
          Check-Out Cartons
        </Text>
      </TouchableOpacity>
      </>
        ) : (
          <ScrollView>
          {filtered.map((carton, index) => (
            <CartonCard
              key={carton?.container_id}
              cartonID={String(carton?.container_id)}
              to={carton?.container.going_to}
              totalConsignment={carton?.container.consignments.length}
              date={new Date(carton?.container.created_at).toLocaleString()}
            />
          ))}
          </ScrollView>
        )}
      
      
    </View>
  );
};

export default CheckIn;
