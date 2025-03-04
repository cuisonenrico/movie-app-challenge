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
import DebouncedTextInput from "./components/debouncing_input";

export default function MovieHome() {
  const { theme, toggleTheme, enableSystemTheme, useSystem } = useTheme();

  var isDarkTheme = theme === "dark";

  const [page, setPage] = useState(1); // Tracks current page for pagination
  const [trackedQuery, setQuery] = useState("Marvel"); // Maintains query parameter for on end scroll request
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async (query: string, hasChanged: boolean) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=b9bd48a6&s=${query}&type=movie&page=${page}`
      );

      if (response.data["Search"] != null) {
        // Sets the movies from API request
        // If query changed, reset the state and only show movies from new query.
        // Otherwise, append the list of the query to the existing list in state
        setMovies((prevMovies) => {
          const appendMovies = hasChanged === true ? [] : prevMovies;

          return Array.from(
            new Set([...appendMovies, ...response.data["Search"]])
          );
        });

        // Increase page number but reverts back to [1] when query has changed
        setPage((prevPage) => (hasChanged === true ? 1 : prevPage + 1));
        // Stores the query value in state so we can load more items from this query
        setQuery(query);
      }
    } catch (err) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handles query when user is at end of scroll
  const onEndScroll = () => {
    fetchMovies(trackedQuery, false);
  };

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
      {/* <AppButton
        label="system"
        onPress={enableSystemTheme}
        isDarkTheme={isDarkTheme}
      /> */}
      <FlatList
        data={movies}
        renderItem={({ item }) => <AppGridItem item={item} />}
        keyExtractor={(item) => item.imdbID}
        numColumns={2} // Ensures at least 2 per row
        horizontal={false} // Restricts horizontal scrolling (default)
        scrollEnabled={true} // Ensures vertical scrolling works
        onEndReached={onEndScroll} // Load more when reaching the bottom
        onEndReachedThreshold={0.5} // Load when 50% of the screen remains
        ListHeaderComponent={() => (
          <View>
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
            <View>
              <DebouncedTextInput onSearch={fetchMovies} />
            </View>
          </View>
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="white" /> : null
        }
      />
    </AppSafeAreaView>
  );
}
