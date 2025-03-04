import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Movie } from "@/models/movie";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Heart } from "lucide-react-native"; // Lucide icons are lightweight

const AppGridItem = ({
  item,
  showFavoriteIcon = true,
}: {
  item: Movie;
  showFavoriteIcon?: boolean;
}) => {
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth / 2 - 20; // 2 columns with margin
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState<Movie[]>([]);

  const router = useRouter();

  const handlePress = async () => {
    await AsyncStorage.setItem("selectedMovie", JSON.stringify(item)); // Save to AsyncStorage
    router.push("/movieDetails");
  };

  useEffect(() => {
    isInFavorites();
  });

  const isInFavorites = async () => {
    try {
      const storedMovies = await AsyncStorage.getItem("favoriteMovies");
      const moviesList = storedMovies ? JSON.parse(storedMovies) : [];

      const uniqueMovies = moviesList.filter(
        (movie: { imdbID: string }, index: any, self: any[]) =>
          index === self.findIndex((m) => m.imdbID === movie.imdbID)
      );
      setFavorites(() => uniqueMovies);

      const isFavorite = favorites.some(
        (favorite) => favorite.imdbID == item.imdbID
      );

      setIsFavorite(isFavorite);

      return uniqueMovies;
    } catch (error) {
      console.error("Error retrieving movies:", error);
      return [];
    }
  };

  const addFavorite = async () => {
    if (!isFavorite) {
      try {
        // Get existing list from AsyncStorage
        const storedMovies = await AsyncStorage.getItem("favoriteMovies");

        // Parse it (or default to an empty array if null)
        const moviesList = storedMovies ? JSON.parse(storedMovies) : [];

        // Add the new movie to the list
        const newUpdatedMovies = Array.from(new Set([...moviesList, item]));

        // Make sure it is unique
        const uniqueMovies = newUpdatedMovies.filter(
          (movie: { imdbID: string }, index: any, self: any[]) =>
            index === self.findIndex((m) => m.imdbID === movie.imdbID)
        );

        // Save the updated list back to AsyncStorage

        await AsyncStorage.setItem(
          "favoriteMovies",
          JSON.stringify(uniqueMovies)
        );
        isInFavorites();
      } catch (error) {
        console.error("Error adding movie:", error);
      }
    } else {
      // Make sure it is unique and remove the selected item
      const uniqueMovies = favorites.filter(
        (fav) => fav.imdbID !== item.imdbID
      );

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem(
        "favoriteMovies",
        JSON.stringify(uniqueMovies)
      );
      isInFavorites();
    }
  };

  const favoriteIcon = () => {
    if (showFavoriteIcon) {
      return (
        <TouchableOpacity
          className="absolute top-8 right-4 p-1 rounded-full bg-white"
          onPress={(e) => {
            e.stopPropagation();
            addFavorite();
          }}
        >
          <Heart
            size={24}
            color={isFavorite ? "red" : "gray"}
            fill={isFavorite ? "red" : "transparent"}
          />
        </TouchableOpacity>
      );
    } else {
      return;
    }
  };

  return (
    <View className="relative">
      <TouchableOpacity
        onPress={handlePress}
        className="relative flex-4 m-2 p-1 rounded-lg items-center"
        style={{ width: itemWidth }}
      >
        <View
          className="flex-4 m-2 p-1 rounded-lg items-center"
          style={{ width: itemWidth }}
        >
          <Image
            className="rounded-lg"
            source={
              imageError
                ? require("../../assets/placeholder.png") // Local placeholder image
                : { uri: item.Poster }
            }
            onError={() => setImageError(true)}
            style={{ width: itemWidth, height: 300, marginVertical: 0 }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              bottom: 10,
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay
              padding: 8,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <Text className="text-white font-bold text-center">
              {item.Title}
            </Text>
          </View>
        </View>
        {favoriteIcon()}
      </TouchableOpacity>
    </View>
  );
};

export default AppGridItem;
