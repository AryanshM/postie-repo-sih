import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  GestureResponderEvent,
  Linking,
} from "react-native";

// Importing the call icon (make sure the path is correct)
import callIcon from "../assets/callIcon.png";
import { useFonts } from "expo-font";

interface ConsignmentCardProps {
  id: number;
  address: string;
  pincode: number;
  mobile: string;
  onCallPress?: (event: GestureResponderEvent) => void; // Optional callback for call action
}

const ConsignmentCard: React.FC<ConsignmentCardProps> = ({
  id,
  address,
  pincode,
  mobile,
  onCallPress,
}) => {
  const [fontsLoaded] = useFonts({
    RobotoBold: require("../../../..//assets/fonts/Roboto-Bold.ttf"),
    RobotoRegular: require("../../../../assets/fonts/Roboto-Regular.ttf"),
    PoppinsRegular: require("../../../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../../../assets/fonts/Poppins-Bold.ttf"),
  });

  const handleCall = () => {
    console.log(`Calling ${mobile}`);
    if (onCallPress) onCallPress({});

    // Open the phone dialer with the given phone number
    Linking.openURL(`tel:${mobile}`).catch((err) =>
      console.error("Failed to make a call", err),
    );
  };

  return (
    <View
      style={{
        marginVertical: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          marginBottom: 5,
          fontFamily: "PoppinsBold",
        }}
      >
        Consignment ID - {id}
      </Text>
      <Text
        style={{ fontSize: 16, marginBottom: 5, fontFamily: "PoppinsRegular" }}
      >
        Address: {address}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View className="w-72">
          <Text
            style={{
              fontSize: 16,
              marginBottom: 5,
              fontFamily: "PoppinsRegular",
            }}
          >
            Pincode: {pincode}
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 5,
              fontFamily: "PoppinsRegular",
            }}
          >
            Mobile: {mobile}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCall}
          style={{
            width: 60,
            height: 60,
            padding: 8,
            backgroundColor: "#CD3431",
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={callIcon}
            style={{
              width: 40,
              height: 40,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConsignmentCard;
