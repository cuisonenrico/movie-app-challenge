import React from "react";
import { StatusBar } from "expo-status-bar";

export default function AppStatusBar({
  isDarkTheme,
}: {
  isDarkTheme: boolean;
}) {
  return <StatusBar style={isDarkTheme ? "light" : "dark"} />;
}
