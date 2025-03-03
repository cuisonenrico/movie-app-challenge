import { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme(); // Detects system theme changes
  const [theme, setTheme] = useState(systemTheme);
  const [useSystem, setUseSystem] = useState(true); // New state to track system theme usage

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedUseSystem = await AsyncStorage.getItem("useSystem");

      if (savedUseSystem === false && savedTheme === null) {
        setUseSystem(true);
        setTheme(systemTheme); // Use system theme
      } else {
        if (savedUseSystem === "true") {
          setUseSystem(true);
          setTheme(systemTheme); // Use system theme
        } else if (savedTheme) {
          setUseSystem(false);
          setTheme(savedTheme);
        }
      }
    };

    loadTheme();
  }, [systemTheme]); // Re-run when system theme changes

  const toggleTheme = async () => {
    if (useSystem) {
      setUseSystem(false);
      await AsyncStorage.setItem("useSystem", "false");
    }
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const enableSystemTheme = async () => {
    setUseSystem(true);
    await AsyncStorage.setItem("useSystem", "true");
    setTheme(systemTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, enableSystemTheme, useSystem }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
