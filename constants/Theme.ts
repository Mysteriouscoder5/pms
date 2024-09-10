import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

export const BUTTONS = {};
export const SIZES = {
  xs: 10,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 28,
  width,
  height,
};
export const INSETS = () => {
  const insets = useSafeAreaInsets();
  return insets;
};
