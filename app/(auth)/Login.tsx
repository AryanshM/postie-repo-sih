import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const Index = () => {
  const [valid, setValid] = useState(false);
  const [employeID, setEmployeID] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const router = useRouter();

  const submitId = async () => {
    setLoading(true);
    const acessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    const type = await SecureStore.getItemAsync("type");

    if(acessToken){
      await SecureStore.deleteItemAsync("accessToken");
    }
    if(refreshToken){
      await SecureStore.deleteItemAsync("refreshToken");
    }
    if(type){
      await SecureStore.deleteItemAsync("type");
    }

    const url = "https://post.rootski.live";
    try {
      const response = await axios.post(`${url}/employee/employee_login/`, {
        Employee_id: employeID,
        password: password,
      });

      if (response.status === 200) {
        const { access, refresh, type } = response.data;
        await SecureStore.setItemAsync("accessToken", access);
        await SecureStore.setItemAsync("refreshToken", refresh);
        await SecureStore.setItemAsync("type", type);
        
        if (type === "spo") {
          router.replace("/(home-screen)/(spo)/(tabs)/Home");
        }
        else if(type === "hpo"){
          router.replace("/(home-screen)/(hpo)/(tabs)/Home");
        }
        else if( type === "ich"){
          router.replace("/(home-screen)/(ich)/(tabs)/Home");
        }
        else if(type === "nsh"){
          router.replace("/(home-screen)/(nsh)/(tabs)/Home");
        }
        else if(type === "postman"){
          router.replace("/(home-screen)/(postman)/(tabs)/Home");
        }

      } else {
        Alert.alert("Error", "Something went wrong");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Error", "Please check your credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FFF8F2] justify-center items-center p-4">
      <Image
        className="w-[250px] h-[250px] mb-6"
        source={images.delivery}
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-gray-800 mb-3 text-center">
        Enter your Employee ID and Password
      </Text>

      <View className={`w-[90%] my-4 `}>
        <TextInput
          className="w-full border rounded-xl border-gray-400 p-4 text-xl text-gray-700"
          placeholder="Employee ID"
          keyboardType="number-pad"
          value={employeID}
          onChangeText={(text) => setEmployeID(text)}
        />
      </View>

      <View className="w-[90%] my-4  ">
        <TextInput
          className="w-full border rounded-xl border-gray-400  p-4 text-xl text-gray-700"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View className="w-[90%] mt-6">
        <TouchableOpacity
          onPress={submitId}
          disabled={employeID === "" || password === "" || loading}
          className={`w-full py-4 rounded-lg items-center ${employeID === "" ? "bg-red-600/60" : "bg-primaryColor"} `}
        >
          <Text className="text-white text-xl font-semibold">
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>

      {error !== "" && (
        <Text className="text-red-600 text-center mt-4">{error}</Text>
      )}
    </View>
  );
};

export default Index;
