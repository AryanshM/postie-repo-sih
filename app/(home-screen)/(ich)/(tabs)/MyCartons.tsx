import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import images from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import api from "@/hooks/api/retrievToken";
import { icons } from "@/constants";
const MyCartonsScreen = () => {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const [cartons, setCartons] = useState<
    {
      container_id: string;
      created_at: string;
      going_to: string;
      consignments: any[];
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCartons = async () => {
      setLoading(true);
      try {
        const response = await api.get("/employee/get_containers/");
        if (response.status === 200) {
          setCartons(response?.data);
          setFilteredCartons(response.data);
        }
      } catch (error) {
        console.log("Error while fetching cartons", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartons();
  }, []);

  const [filteredCartons, setFilteredCartons] =
    useState<
      {
        container_id: string;
        created_at: string;
        going_to: string;
        consignments: any[];
      }[]
    >(cartons);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredCartons(cartons);
    } else {
      const filtered = cartons.filter((carton) =>
        carton.going_to.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredCartons(filtered);
    }
  };

  const handleDetails = (container_id: string) => () => {
    router.push({
      pathname: "/(home-screen)/(ich)/(services)/(create-carton)/Next",
      params: {
        container_id: JSON.stringify(container_id),
      },
    });
  };

  const renderCarton = ({ item }) => (
    <TouchableOpacity
      onPress={handleDetails(item.container_id)}
      className="flex bg-white p-4 rounded-lg shadow-md my-2  flex-row gap-6"
    >
      <Image
        source={icons.cartonIcon}
        className="w-20 h-20 rounded-md justify-center items-center my-auto"
      />
      <View className=" ">
        <Text className="text-lg font-semibold text-[#333]">
          Container ID: {item.container_id}
        </Text>
        <Text className="text-sm text-[#777]">
          Created At: {new Date(item.created_at).toLocaleString()}
        </Text>
        <Text className="text-sm text-[#777]">Going To: {item.going_to}</Text>

        <Text className="text-sm text-[#777] mb-4">
          Total Consignments : {item.consignments.length}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View className="flex-1 bg-[#F9F9F9] p-4">
      {/* Header */}
      <View className="flex-row items-center mt-6">
        <TouchableOpacity
          onPress={() => router.replace("/(home-screen)/(ich)/(tabs)/Home")}
          className="p-2 bg-[#ECECEC] rounded-full"
        >
          <Ionicons name="arrow-back-outline" size={26} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold ml-4">Cartons List</Text>
      </View>
      {/* Search Bar */}
      <View className="bg-white px-3 py-1 rounded-md shadow-md mb-6 mt-7 gap-2 flex-row items-center">
        <Ionicons
          name="search-outline"
          size={22}
          className="mb-1"
          color="#999"
        />
        <TextInput
          className="flex-1 text-base text-[#333]"
          placeholder="Search by destination..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Cartons List */}
      <FlatList
        data={filteredCartons}
        keyExtractor={(item) => item.container_id.toString()}
        renderItem={renderCarton}
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-500 mt-10">
            No cartons found.
          </Text>
        )}
      />
    </View>
  );
};

export default MyCartonsScreen;
