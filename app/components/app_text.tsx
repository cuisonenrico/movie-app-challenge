import React from "react";
import { Text } from "react-native";

const AppText = ({
  text,
  isDarkTheme,
  customStyle,
}: {
  text: string;
  isDarkTheme: boolean;
  customStyle?: string;
}) => {
  // Dynamic styles based on theme
  const appendStyle = customStyle != null ? customStyle : "text-xl";
  const style = isDarkTheme
    ? `${appendStyle} text-white`
    : `${appendStyle} text-black`;
  return <Text className={style}>{text}</Text>;
};

export default AppText;
