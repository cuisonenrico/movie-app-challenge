import { useTheme } from "../context/themeContext";
import AppText from "./components/app_text";
import AppSafeAreaView from "./components/app_safe_area_view";
import AppStatusBar from "./components/app_status_bar";
import { FlatList, Text, ActivityIndicator, View, Image } from "react-native";
import AppGridItem from "./components/app_grid_item";
import { useEffect, useState } from "react";
import axios from "axios";
import { Movie } from "@/models/movie";
import { Link } from "expo-router";
import AppButton from "./components/app_button";

export default function MovieHome() {
  const { theme, toggleTheme, enableSystemTheme, useSystem } = useTheme();

  var isDarkTheme = theme === "dark";

  const [movies, setMovie] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://www.omdbapi.com/?apikey=b9bd48a6&s=Marvel&type=movie&page=1"
        );
        setMovie(response.data["Search"]);
      } catch (err) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        className="flex-1 items-center justify-center"
        size="large"
        color="#0000ff"
      />
    );
  if (error) return <Text className="text-red-500">Error: {error}</Text>;

  return (
    <AppSafeAreaView isDarkTheme={isDarkTheme}>
      <AppStatusBar isDarkTheme={isDarkTheme} />

      <FlatList
        data={movies}
        renderItem={({ item }) => <AppGridItem item={item} />}
        keyExtractor={(item) => item.imdbID}
        numColumns={2} // Ensures at least 2 per row
        horizontal={false} // Restricts horizontal scrolling (default)
        scrollEnabled={true} // Ensures vertical scrolling works
        ListHeaderComponent={() => (
          <View className="flex flex-row justify-between pr-4 pl-4 pt-4 w-screen space-x-5">
            <AppText
              text="MotionMe App"
              isDarkTheme={isDarkTheme}
              customStyle="text-3xl font-bold"
            />

            <Link href={"/profile"}>
              <View className="w-12 h-12 bg-blue-500 rounded-full"></View>
            </Link>
          </View>
        )}
      />
      {/* <AppButton
        label="New Buttons"
        onPress={toggleTheme}
        isDarkTheme={isDarkTheme}
      />
      <AppButton
        label="Use System Theme"
        onPress={enableSystemTheme}
        isDarkTheme={isDarkTheme}
      /> */}
    </AppSafeAreaView>
  );
}
