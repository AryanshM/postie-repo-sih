import { View, Text, Image, TextInput, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import {jwtDecode} from "jwt-decode";
import * as SecureStore from "expo-secure-store"
import images from "@/constants/images";
import axios from "axios";
const Index = () => {
  const router = useRouter();
  const [loading , setLoading] = React.useState(false);

  interface DecodedToken {
    exp: number;
  }


  
  //Is Token expired ->
  const isTokenExpired = (token:string):  boolean =>{
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp < now) {
        return true;
      }
      else return false;
      
    } catch (error) {
      console.log(error)
      return true 
    }
  }

  

  

  const refreshAccessToken = async ()=>{
    const refreshToken = await SecureStore.getItemAsync("refreshToken")
    if(refreshToken){
      try {
        const response = await axios.post("https://post.rootski.live/employee/access_byrefresh/",{
          refresh : refreshToken
        }) 
        const newAcessToken = response.data.access;
       
        await SecureStore.setItemAsync("accessToken",newAcessToken)
        return true;
      } catch (error) {
        console.log("Token refresh failed" , error)
        return false;
      }
    }
  }

  
  const checkTokens = async () => {
    setLoading(true);
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const accessToken = await SecureStore.getItemAsync("accessToken");
      const type = await SecureStore.getItemAsync("type");
  
      if (accessToken && !isTokenExpired(accessToken)) {
        if (type === "spo") router.replace("/(home-screen)/(spo)/(tabs)/Home");
        else if (type === "hpo") router.replace("/(home-screen)/(hpo)/(tabs)/Home");
        else if (type === "ich") router.replace("/(home-screen)/(ich)/(tabs)/Home");
        else if (type === "nsh") router.replace("/(home-screen)/(nsh)/(tabs)/Home");
        else if (type === "postman") router.replace("/(home-screen)/(postman)/(tabs)/Home");
      } else if (refreshToken) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          const newAccessToken = await SecureStore.getItemAsync("accessToken");
          const newType = await SecureStore.getItemAsync("type");
          if (newAccessToken && newType === "spo") {
            router.replace("/(home-screen)/(spo)/(tabs)/Home");
          } else if (newAccessToken && newType === "hpo") {
            router.replace("/(home-screen)/(hpo)/(tabs)/Home");
          } else if (newAccessToken && newType === "ich") {
            router.replace("/(home-screen)/(ich)/(tabs)/Home");
          } else if (newAccessToken && newType === "nsh") {
            router.replace("/(home-screen)/(nsh)/(tabs)/Home");
          }
        } else {
          router.replace("/(auth)/Login");
        }
      } else {
        router.replace("/(auth)/Login");
      }
    } catch (error) {
      console.log("Error checking tokens:", error);
      router.replace("/(auth)/Login");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    checkTokens();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-[#F5F5F5] justify-center items-center">
        <ImageBackground
          source={images.splash}
          resizeMode="contain"
          className="w-full h-full"
        />
      </View>
    );
  }

  return null;
};

  

   



export default Index;
