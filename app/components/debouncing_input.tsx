import { useTheme } from "@/context/themeContext";
import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, Text } from "react-native";

interface DebouncedTextInputProps {
  onSearch: (query: string, hasChanged: boolean) => void;
  hint?: string;
}

const DebouncedTextInput: React.FC<DebouncedTextInputProps> = ({
  onSearch,
  hint = "Search...",
}) => {
  const { theme } = useTheme();

  const isDarkTheme = theme === "dark";

  const [input, setInput] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");
  const previousValue = useRef<string>(""); // Store previous value

  useEffect(() => {
    const handler = setTimeout(() => {
      const hasChanged = previousValue.current !== input;

      if (hasChanged) {
        setDebouncedValue(input);
        onSearch(input, hasChanged);
        previousValue.current = input; // Update previous value
      }
    }, 500); // 500ms debounce time

    return () => clearTimeout(handler);
  }, [input, debouncedValue, onSearch]);

  return (
    <View className="flex-1 p-2">
      <TextInput
        className={`border border-gray-300 rounded-lg p-3 text-lg  ${
          isDarkTheme ? "text-white" : "text-black"
        }`}
        placeholder={`${debouncedValue == "" ? `${hint}` : debouncedValue}`}
        placeholderTextColor={`${isDarkTheme ? "white" : "black"}`}
        value={input}
        onChangeText={setInput}
      />
    </View>
  );
};
export default DebouncedTextInput;
