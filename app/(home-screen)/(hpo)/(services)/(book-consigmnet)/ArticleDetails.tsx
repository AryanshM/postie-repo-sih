import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import ProgreessConsigment from "@/components/ProgreessConsigment";
import InputField from "@/components/InputField";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";
import MovingButton from "@/components/MovingButton";
import { useDispatch } from "react-redux";
import { setarticleDetails } from "@/redux/slices/consignmentSlice";

export default function ArticleDetails() {
  const dispatch = useDispatch();
  const width = Dimensions.get("window").width;
  const [articleDetails, setArticleDetails] = useState({
    type: "",
    service: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Letter/Document", value: "document" },
    { label: "Parcel", value: "parcel" },
  ]);

  const isTablet = width > 550;
  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceValue, setServiceValue] = useState(null);
  const [serviceItems, setServiceItems] = useState([
    { label: "Speed Post", value: "speedpost" },
    { label: "Normal", value: "other" },
  ]);

  let moveToBack = () => {
    router.push("/(home-screen)/(hpo)/(tabs)/Home");
  };

  const moveToNext = () => {
    if (
      !articleDetails.type ||
      !articleDetails.service ||
      (articleDetails.type === "parcel" &&
        (!articleDetails.width ||
          !articleDetails.height ||
          !articleDetails.length ||
          !articleDetails.weight))
    ) {
      alert("Please fill in all required details.");
      return;
    }

    dispatch(setarticleDetails(articleDetails));
    router.push("/(home-screen)/(hpo)/(services)/(book-consigmnet)/AddressDetails");
  };

  return (
    <View className="flex-1 bg-screenBackgroundColor">
      {/* Header */}
      <ProgreessConsigment
        currentSteps={1}
        heading="Article Details"
        subheading=" Please provide the details of your package"
        handleBack={moveToBack}
      />

      {/* Article Details */}
      <View className=" mt-5 px-4 flex">
        {/* Service Type */}
        <View
          className=" mt-8 space-y-4"
          style={{ zIndex: serviceOpen ? 1000 : 1 }}
        >
          <Text className="text-sm text-[#333] font-semibold">
            Service Type
          </Text>
          <DropDownPicker
            open={serviceOpen}
            value={serviceValue}
            items={serviceItems}
            setOpen={(open) => {
              setServiceOpen(open);
              if (open) setOpen(false);
            }}
            setValue={setServiceValue}
            setItems={setServiceItems}
            onChangeValue={(value) => {
              if (value !== null) {
                setArticleDetails({ ...articleDetails, service: value });
              }
            }}
            placeholder="Select Service Type"
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 8,
              backgroundColor: "white",
            }}
            dropDownContainerStyle={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 8,
              backgroundColor: "white",
            }}
            textStyle={{
              fontSize: 16,
              color: "black",
            }}
            placeholderStyle={{
              color: "#C4bfb6",
            }}
          />
        </View>

        {/* Item Type */}
        <View className=" mt-4 space-y-4" style={{ zIndex: open ? 999 : 1 }}>
          <Text className="text-sm text-[#333] font-semibold">Item Type</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={(open) => {
              setOpen(open);
              if (open) setServiceOpen(false); // Close other dropdown
            }}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={(value) => {
              if (value !== null) {
                setArticleDetails({ ...articleDetails, type: value });
              }
            }}
            placeholder="Select Item Type"
            style={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 8,
              backgroundColor: "white",
            }}
            dropDownContainerStyle={{
              borderWidth: 1,
              borderColor: "#E0E0E0",
              borderRadius: 8,
              backgroundColor: "white",
            }}
            textStyle={{
              fontSize: 16,
              color: "black",
            }}
            placeholderStyle={{
              color: "#C4bfb6",
            }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-4    text-center ">
        {/* Parcel Details */}

        {articleDetails.type === "parcel" && (
          <>
            <InputField
              className="mt-6 px-1"
              heading={"Width (in cm)"}
              value={articleDetails.width}
              placeholder={"Eg: 30"}
              onChangeText={(text) =>
                setArticleDetails({ ...articleDetails, width: text })
              }
              keyboardType="numeric"
            />
            <InputField
              className="mt-6 px-1"
              heading={"Length (in cm)"}
              value={articleDetails.length}
              placeholder={"Eg: 10"}
              onChangeText={(text) =>
                setArticleDetails({ ...articleDetails, length: text })
              }
              keyboardType="numeric"
            />
            <InputField
              className="mt-6 px-1"
              heading={"Height (in cm)"}
              value={articleDetails.height}
              placeholder={"Eg: 300"}
              onChangeText={(text) =>
                setArticleDetails({ ...articleDetails, height: text })
              }
              keyboardType="numeric"
            />
            <InputField
              className="mt-6 px-1"
              heading={"Weight (in gm)"}
              value={articleDetails.weight}
              placeholder={"Eg: 300"}
              onChangeText={(text) =>
                setArticleDetails({ ...articleDetails, weight: text })
              }
              keyboardType="numeric"
            />
          </>
        )}
      </ScrollView>
      {/* Navigation Buttons */}
      <MovingButton
        className="px-4"
        moveToBack={moveToBack}
        moveToNext={moveToNext}
      />
    </View>
  );
}
