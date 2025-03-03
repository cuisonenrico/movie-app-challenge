import { Button, TouchableOpacity, Text } from "react-native";
import React from "react";
import AppText from "./app_text";

enum ButtonSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

const AppButton = ({
  label,
  color,
  onPress,
  isDarkTheme,
  buttonSize,
}: {
  label: string;
  color?: string;
  onPress: () => void;
  isDarkTheme: boolean;
  buttonSize?: ButtonSize;
}) => {
  return (
    <TouchableOpacity
      className={`px-4 py-3 rounded-lg ${
        isDarkTheme ? "bg-blue-600" : "bg-blue-500"
      }`}
      onPress={onPress}
    >
      <AppText text={label} isDarkTheme={isDarkTheme} customStyle="text-3xl" />
    </TouchableOpacity>
  );

  //   <Button title={label} color={color} onPress={onPress} />
};

export default AppButton;
