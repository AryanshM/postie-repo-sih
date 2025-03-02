import { useFonts } from "expo-font";

const [fontsLoaded] = useFonts({
  RobotoBold: require("./Roboto-Bold.ttf"), // Update the paths as needed
  RobotoRegular: require("./Roboto-Regular.ttf"),
  PoppinsRegular: require("./Poppins-Regular.ttf"),
  PoppinsBold: require("./Poppins-Bold.ttf"),
});
