import { ActivityIndicator, FlatList } from "react-native";
import React from "react";
import AppSafeAreaView from "./components/app_safe_area_view";
import { useEffect, useState } from "react";

import AppStatusBar from "./components/app_status_bar";
import { useTheme } from "../context/themeContext";
import AppGridItem from "./components/app_grid_item";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MovieDetailed } from "@/models/movie_detailed";

const Profile = () => {
  const { theme } = useTheme();

  var isDarkTheme = theme === "dark";

  const [movies, setMovie] = useState<MovieDetailed[]>([]);
  const getMoviesFromStorage = async () => {
    try {
      const storedMovies = await AsyncStorage.getItem("favoriteMovies");
      const moviesList = storedMovies ? JSON.parse(storedMovies) : [];

      const uniqueMovies = moviesList.filter(
        (movie: { imdbID: string }, index: any, self: any[]) =>
          index === self.findIndex((m) => m.imdbID === movie.imdbID)
      );
      setMovie(() => uniqueMovies);

      return uniqueMovies;
    } catch (error) {
      console.error("Error retrieving movies:", error);
      return [];
    }
  };

  useEffect(() => {
    getMoviesFromStorage();
  }, []);
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
      />
    </AppSafeAreaView>
  );
};

export default Profile;
