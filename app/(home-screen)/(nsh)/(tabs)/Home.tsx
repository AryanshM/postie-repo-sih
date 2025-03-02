import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  Image,
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
import frontBanner from "./frontBanner.png"
const { width } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const handleBookNow = () => {
    console.log("Book Now");
  };

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

  const banners = [
    {
      title: "Complaints",
      description: "Review and track raised Complaints.",
      image: images.banner1,
      onPress: handleBookNow,
      buttonTitle: "Complaints",
    },
    {
      title: "Create Cartons",
      description:
        "Organize shipments into cartons for easier tracking and delivery.",
      image: images.banner2,
      onPress: handleCarton,
      buttonTitle: "Create Carton",
    },
    {
      title: "Check-in",
      description:
        "Check-in incoming consignments for easier sorting and tracking",
      image: images.banner3,
      onPress: handleCheckIn,
      buttonTitle: "Check-in",
    },
    {
      title: "Check-out",
      description:
        "Check-out consignments from delivery centres for better tracking",
      image: images.banner4,
      onPress: handleBookNow,
      buttonTitle: "Check-out",
    },
    {
      title: "Check-out HPO",
      description: "Check out from SPO to the HPO",
      image: images.banner5,
      onPress: handleBookNow,
      buttonTitle: "Check-out",
    },
    {
      title: "Print Slip",
      description: "Register hassle free shipments by generating slips.",
      image: images.banner3,
      onPress: handleBookNow,
      buttonTitle: "Print Slip",
    },
  ];

  const handleComplaints = () => {
    router.push("/(home-screen)/(nsh)/(services)/(complaints)/ComplaintStatus");
  };

  const handlePrintSlip = () => {
    router.push("/(home-screen)/(nsh)/(services)/(printSlip)/PrintSlip");
  };

  const handleCarton = () => {
    router.push("/(home-screen)/(nsh)/(services)/(create-carton)/Create");
  };

  const handleCheckIn = () => {
    router.push("/(home-screen)/(nsh)/(services)/(check-in)/CheckIn");
  };

  const handleCheckOutHPO = () => {
    router.push("/(home-screen)/(nsh)/(services)/(check-out)/CheckOutHPO");
  };
  const handleSorting = () => {
    router.push("/(home-screen)/(nsh)/(services)/(secondary-sorting)/Scan");
  };
  const handlePreliminary = () => {
    router.push("/(home-screen)/(nsh)/(services)/(preliminary-sorting)/Scan");
  };

  const services = [
    {
      title: "Create cartons",
      image: images.banner2,
      onPress: handleCarton,
    },
    {
      title: "Secondary Sorting",
      image: images.sortPost,
      onPress: handleSorting,
    },
    {
      title: "Preliminary Sorting",
      image: images.preliminarySorting,
      onPress: handlePreliminary,
    },
    {
      title: "Check in",
      image: images.banner3,
      onPress: handleCheckIn,
    },

    {
      title: "Check Out for ICH",
      image: images.banner5,
      onPress: handleCheckOutHPO,
    },
    {
      title: "Print Slip",
      image: images.banner6,
      onPress: handlePrintSlip,
    },
    {
      title: "Complaints",
      image: images.banner1,
      onPress: handleComplaints,
    },
  ];

  const scrollViewRef = React.useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const isTablet = width > 550;
  const dispatch = useDispatch<typeof store.dispatch>();
  const { data, status, error } = useSelector((state: any) => state.userData);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched && status === "idle") {
      dispatch(fetchData());
      setHasFetched(true);
    }
  }, [hasFetched, status, dispatch]);

  // Auto-scroll banners
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
  }, [activeIndex, banners.length]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / width);
    setActiveIndex(currentIndex);
  };

  const timeOfDay = new Date().getHours();
  let greeting = "Namaste";

  if (timeOfDay < 12) {
    greeting = "Good Morning";
  } else {
    greeting = "Good Evening";
  }

  return (
    <View className="flex-1 bg-primaryColor">
      {/* Header Section */}

      <View className="h-[23%] w-full bg-primaryColor shadow-lg">
        <View className="mt-4 flex flex-row p-4 justify-between">
          {/* Left Section: Greeting and Image */}
          <View className="flex-row items-center flex-1">
            {/* User Image */}
            <Image
              source={{
                uri:
                  userData?.data?.profile_picture ||
                  "https://th.bing.com/th/id/OIP._wzrOCy6F1cV-gE-Qzn04gHaHa?w=206&h=206&c=7&r=0&o=5&dpr=1.3&pid=1.7",
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "#FFF8F2",
                marginRight: 10,
              }}
            />
            <View>
              {/* Greeting and Name */}
              <View>
              <Text
                className="text-white font-semibold"
                style={[{ fontSize: isTablet ? 22 : 18 }]}
              >
                {greeting}, {data?.first_name}!
              </Text>
              </View>
              <View>
                {loading ? (
                  <Text>Loading...</Text>
                ) : (
                  <Text
                    className="text-white"
                    style={{ fontSize: isTablet ? 15 : 12 }}
                  > <Text className="font-bold">NSH</Text> {data?.city_district} {data?.state} - {data?.pincode}
                  </Text>
                )}
              </View>
            </View>
            

          </View>
          

          {/* Right Section: Notification Icon */}
          <View className="flex justify-center items-center ">
            <Ionicons name="notifications-outline" size={24} color="#FFF8F2" />
          </View>
        </View>
        <View className="items-center w-full mt-1">
          <Text className="text-white font-semibold text-xl text-center">All-In-One Access</Text>
          <Text className="text-white font-semibold text-xl text-center">Simplify your Day</Text>
        </View>
      </View>

      {/* Main Content Section */}
      <View className="flex-1 bg-[#F5F5F5] -mt-[7%] rounded-tl-[7%] pt-6  shadow-md">
        <ScrollView>
          {/* Banner Section */}
          <View className="w-full p-1">
            <Image className="w-full h-52" source={frontBanner}></Image>
          </View>
          {/* Services Section */}
          <View className="flex-wrap flex-row justify-between px-4">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;
