import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "@/constants";
import Banner from "@/components/Banner";
import ServiceCard from "@/components/ServiceCard";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "@/redux/slices/userDataSlice";
import store from "@/redux/store";
import illustration from "../assets/illustration.png";
import confirmDelivery from "../assets/confirmDelivery.png";
import scanConsignment from "../assets/scanConsignment.png";
import ListOfConsignment from "../assets/listOfConsignment.png";
import { useFonts } from "expo-font";

const Home = () => {
  console.log("loaded")
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    RobotoBold: require("../../../..//assets/fonts/Roboto-Bold.ttf"),
    RobotoRegular: require("../../../../assets/fonts/Roboto-Regular.ttf"),
    PoppinsRegular: require("../../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../../assets/fonts/Poppins-Bold.ttf"),
  });
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch<typeof store.dispatch>();
  const { data, status, error } = useSelector((state: any) => state.userData);
  const [hasFetched, setHasFetched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    data: {
      Email: "",
      address_details: "",
      city_district: "",
      country: "",
      first_name: "",
      pincode: "",
      profile_picture: "",
      image: "",
      state: "",
    },
    phone_number: "",
  });

  const timeOfDay = new Date().getHours();
  let greeting = "Namaste";
  console.log("Entered postman section")
  if (timeOfDay < 12) {
    greeting = "Good Morning";
  } else {
    greeting = "Good Evening";
  }

  function handleScan() {
    router.push("/(home-screen)/(postman)/(services)/Scan");
    console.log("Scan");
  }

  function handleList() {
    router.replace("/(home-screen)/(postman)/(tabs)/ListOfConsignment");
    console.log("List");
  }

  function handleDeliver() {
    router.replace("/(home-screen)/(postman)/(services)/Deliver");
    console.log("Deliver");
  }

  return (
    <View className="bg-[#F5F5F5] flex-1">
      <View className="flex-row my-4">
        <Image
          source={{
            uri:
              userData?.data?.profile_picture ||
              "https://th.bing.com/th/id/OIP._wzrOCy6F1cV-gE-Qzn04gHaHa?w=206&h=206&c=7&r=0&o=5&dpr=1.3&pid=1.7",
          }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: "#FFF8F2",
            marginRight: 10,
          }}
        />

        <View className="justify-center">
          {/* Greeting and Name */}
          <Text
            className="font-semibold"
            style={[{ fontSize: 16, fontFamily: "PoppinsBold" }]}
          >
            {greeting}, {data.first_name ? data.first_name : "Aryansh"}!
          </Text>

          <Text style={{ fontSize: 12, fontFamily: "PoppinsRegular" }}>
            {data.city_district ? data.city_district : "Varanasi"}{" "}
            {data.state ? data.state : "Uttar Pradesh"}
            <Text>{" - "}</Text>
            <Text>{String(data.pincode ? data.pincode : "221001")}</Text>
          </Text>
        </View>
      </View>

      <View className="h-500 w-full h-[400] justify-center items-center">
        <Image
          source={illustration}
          className="w-full h-auto"
          resizeMode="contain"
        />
      </View>

      <View className="items-center w-full">
        <Text
          className="text-center text-xl"
          style={{ fontFamily: "PoppinsBold" }}
        >
          Services for you
        </Text>
      </View>
      <View className="flex-row items-center justify-center my-6">
        <TouchableOpacity onPress={() => handleScan()}>
          <View className="items-center mx-6">
            <Image source={scanConsignment} style={{ width: 60, height: 60 }} />
            <Text style={{ fontFamily: "PoppinsRegular", fontSize:12 }}>Scan</Text>
            <Text style={{ fontFamily: "PoppinsRegular", fontSize:12 }}>Consignment</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleList()}>
          <View className="items-center mx-6">
            <Image
              source={ListOfConsignment}
              style={{ width: 60, height: 60 }}
            />
            <Text style={{ fontFamily: "PoppinsRegular" , fontSize:12 }}>List of</Text>
            <Text style={{ fontFamily: "PoppinsRegular" , fontSize:12}}>Consignment</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDeliver()}>
          <View className="items-center mx-6">
            <Image source={confirmDelivery} style={{ width: 60, height: 60 }} />
            <Text style={{ fontFamily: "PoppinsRegular" , fontSize:12}}>Confirm</Text>
            <Text style={{ fontFamily: "PoppinsRegular" , fontSize:12}}>Delivery</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
