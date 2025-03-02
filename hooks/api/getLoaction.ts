import * as Location from "expo-location";

export const getUserLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  try {
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }
    const location = await Location.getCurrentPositionAsync({});
    return {
      lattitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
