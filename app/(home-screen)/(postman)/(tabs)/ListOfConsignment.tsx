import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Headers from "@/components/Headers";
import { useRouter } from "expo-router";
import TodaysConsignment from "../(services)/TodaysConsignment";
import OldConsignment from "../(services)/OldConsignment";
import todayIcon from "../assets/todayIcon.png";
import oldIcon from "../assets/oldIcon.png";
import { useFonts } from "expo-font";

const ListOfConsignment = () => {
  const [fontsLoaded] = useFonts({
    RobotoBold: require("../../../..//assets/fonts/Roboto-Bold.ttf"),
    RobotoRegular: require("../../../../assets/fonts/Roboto-Regular.ttf"),
    PoppinsRegular: require("../../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const router = useRouter();
  const [today, setToday] = useState(true);
  const [active, setActive] = useState("today");

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      className="bg-screenBackgroundColor flex-1 px-4"
    >
      <View className="flex-1 bg-screenBackgroundColor px-4">
        <Headers
          heading="Consignments"
          back={() => router.replace("/(home-screen)/(postman)/(tabs)/Home")}
        />
        <View className="flex-row items-center justify-center">
          {/* Today's Consignment */}
          <TouchableOpacity
            onPress={() => {
              setActive("today");
              setToday(true);
            }}
          >
            <View style={{ alignItems: "center" }} className="m-6 p-6">
              <Image source={todayIcon} style={{ width: 30, height: 30 }} />
              <Text style={{ fontFamily: "PoppinsRegular" }}>Today's</Text>
              <Text style={{ fontFamily: "PoppinsRegular" }}>Consignment</Text>
              <View
                style={{
                  width: active === "today" ? "70%" : "0%",
                  height: "3%",
                  backgroundColor: "red",
                  marginVertical: 4,
                }}
              />
            </View>
          </TouchableOpacity>

          {/* Old Consignment */}
          <TouchableOpacity
            onPress={() => {
              setActive("old");
              setToday(false);
            }}
          >
            <View style={{ alignItems: "center" }} className="m-6 p-6">
              <Image source={oldIcon} style={{ width: 30, height: 30 }} />
              <Text style={{ fontFamily: "PoppinsRegular" }}>Old</Text>
              <Text style={{ fontFamily: "PoppinsRegular" }}>Consignment</Text>
              <View
                style={{
                  width: active !== "today" ? "70%" : "0%",
                  height: "3%",
                  backgroundColor: "red",
                  marginVertical: 4,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Conditional Rendering of Consignments */}
        <View>{today ? <TodaysConsignment /> : <OldConsignment />}</View>
      </View>
    </ScrollView>
  );
};

export default ListOfConsignment;
