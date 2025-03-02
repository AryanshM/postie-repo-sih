import Dimensions from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

const hp = (size) => {
  return (size * deviceHeight) / 100;
};

const wp = (size) => {
  return (size * deviceWidth) / 100;
};

export { hp, wp };
