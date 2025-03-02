import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import api from "@/hooks/api/retrievToken";
import { Ionicons } from "@expo/vector-icons";
import Headers from "@/components/Headers";

const width = Dimensions.get("window").width;

const PrintSlip = () => {
  const [consignmentID, setConsignmentID] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const banners = [
    { source: images.printSlip1 },
    { source: images.printSlip3 },
    { source: images.printSlip2 },
  ];


  const handleNext = async () => {
    setLoading(true);
    try {
      const response = await api.post("/employee/get_consignment_details/", {
        consignment_id: Number(consignmentID),
      });
      if (response.status === 200) {
        setConsignmentID("");
        router.push({
          pathname: "/(home-screen)/(spo)/(services)/(printSlip)/Details",
          params: {
            ...response.data,
            qrCode: JSON.stringify(response.data.qr_url),
            order: JSON.stringify(response.data.order),
            sender_details: JSON.stringify(response.data.sender_details),
            receiver_details: JSON.stringify(response.data.receiver_details),
          },
        });
      } else {
        Alert.alert("Error", response.data.message || "An error occurred.");
      }
    } catch (error) {
      Alert.alert("Error", "Invalid Consignment ID");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      setActiveIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / width);
    setActiveIndex(currentIndex);
  };

  const isTablet = width >550
  return (
    <View className="flex-1 px-1 bg-[#F8FAFC]">
      {/* Header */}
      <Headers
        heading="Print Slip"
        back={() => router.replace("/(home-screen)/(spo)/(tabs)/Home")}
      />
      {/* Banner Section */}
      <View className="mt-6">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false, listener: handleScroll },
          )}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {banners.map((banner, index) => (
            <View
              key={index}
              style={{
                width: width,
                alignItems: "center",
              }}
            >
              <Image
                source={banner.source}
                style={{
                  width: width * 1.3,
                  height: isTablet ? 350 : 280,
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Header Text */}
      <View className="items-center mt-6 px-6">
        <Text className="text-2xl font-bold text-[#333] text-center">
          Ready to Serve You!
        </Text>
        <Text className="text-lg text-[#555] text-center mt-2">
          Enter your consignment ID below to proceed.
        </Text>
      </View>

      {/* Input Section */}
      <View className="items-center mt-8">
        <TextInput
          className="border border-gray-200 bg-[#F9F9F9] rounded-lg py-3 px-3 text-lg shadow-2xl w-[90%]"
          placeholder="Enter Consignment ID"
          placeholderTextColor="#C4bfb6"
          value={consignmentID}
          onChangeText={(text) => setConsignmentID(text)}
          editable={!loading}
          multiline={false}
        />

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="w-[40%] py-3 bg-primaryColor rounded-lg items-center mt-6"
        >
          <Text className="text-white mt-1 text-lg">
            {loading ? "Loading..." : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* OR Section */}
      <View className="items-center mt-8">
        <Text className="text-lg text-[#777]">OR</Text>
        <TouchableOpacity
          onPress={() =>
            router.replace("/(home-screen)/(spo)/(services)/(book-consigmnet)/ArticleDetails")
          }
          className="mt-6"
        >
          <Text className="text-lg text-[#CD3431] underline">
            Create New Consignment →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrintSlip;
