import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "../context/themeContext";
import AppText from "./components/app_text";
import AppSafeAreaView from "./components/app_safe_area_view";
import AppStatusBar from "./components/app_status_bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Movie } from "@/models/movie";
import { MovieDetailed } from "@/models/movie_detailed";
import { useRouter } from "expo-router";

const movieDetails = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const isDarkTheme = theme === "dark";
  const screenSize = Dimensions.get("window");

  const [movie, setMovie] = useState<Movie>();
  const [movieDetailed, setMovieDetailed] = useState<MovieDetailed>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const addFavorite = async () => {
    try {
      // Get existing list from AsyncStorage
      const storedMovies = await AsyncStorage.getItem("favoriteMovies");

      // Parse it (or default to an empty array if null)
      const moviesList = storedMovies ? JSON.parse(storedMovies) : [];

      // Add the new movie to the list
      const newUpdatedMovies = Array.from(
        new Set([...moviesList, movieDetailed])
      );

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
    } catch (error) {
      console.error("Error adding movie:", error);
    }

    router.push("/movieDetails");
  };

  useEffect(() => {
    const loadMovie = async () => {
      const storedMovie = await AsyncStorage.getItem("selectedMovie");

      const apiKey = process.env.EXPO_PUBLIC_API_KEY;

      if (storedMovie) {
        var movieObj = JSON.parse(storedMovie);
        setMovie(movieObj);
        try {
          const response = await axios.get(
            `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieObj["imdbID"]}&plot=full`
          );

          setMovieDetailed(response.data);
        } catch (err) {
          setError(error);
        } finally {
          setLoading(false);
        }
      }
      setLoading(false);
    };

    loadMovie();
  }, []);

  if (loading)
    return (
      <View
        className={`flex-1 items-center justify-center ${
          isDarkTheme ? " bg-black" : " bg-white"
        }`}
      >
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  if (!movie || !movieDetailed) return <Text>No movie found</Text>;

  return (
    <AppSafeAreaView isDarkTheme={isDarkTheme}>
      <AppStatusBar isDarkTheme={isDarkTheme} />
      <ScrollView
        className={`${isDarkTheme ? "bg-black" : "bg-white"}`}
        style={{ width: screenSize.width, height: screenSize.height }}
      >
        <View className="relative w-full h-700">
          <TouchableOpacity activeOpacity={0.8}>
            <Image
              resizeMethod="scale"
              source={{ uri: movieDetailed.Poster }}
              className=""
              style={{ width: screenSize.width, height: 500 }}
            />
          </TouchableOpacity>
        </View>
        <View className="relative -top-14 bottom-0 left-0 right-0 bg-transparent flex-row items-center p-4">
          <Image
            source={{ uri: movieDetailed.Poster }} // Replace with the proper image URL
            className="w-20 h-30 rounded-lg"
            style={{ width: 120, height: 180, marginVertical: 0 }}
          />
          <View className="relative mt-12 ml-4 bottom-0">
            <AppText
              text={movieDetailed.Title}
              isDarkTheme={isDarkTheme}
              customStyle="flex-wrap-reverse flex text-2xl font-bold mr-12"
            />

            <AppText
              text={movieDetailed.Year}
              isDarkTheme={isDarkTheme}
              customStyle="text-gray-500"
            />
            <AppText
              text={`${movieDetailed.Runtime} | ${movieDetailed.Genre}`}
              isDarkTheme={isDarkTheme}
              customStyle="text-gray-700 flex-wrap-reverse flex"
            />

            <Text className="text-green-600">
              {movieDetailed.imdbRating} ⭐ ({movieDetailed.imdbVotes} Reviews)
            </Text>
          </View>
        </View>
        <View className="relative -top-16 bottom-0 left-0 right-0 p-4">
          <AppText
            text="Plot Summary"
            isDarkTheme={isDarkTheme}
            customStyle="text-lg font-semibold mb-2"
          />
          <AppText
            text={movieDetailed.Plot}
            isDarkTheme={isDarkTheme}
            customStyle="text-gray-800 mb-4"
          />
          <AppText
            text="Cast Overview"
            isDarkTheme={isDarkTheme}
            customStyle="text-lg font-semibold mb-2"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {movieDetailed.Actors.split(",").map((actor, index) => (
              <View key={index} className="mr-4">
                <Image
                  source={{ uri: `https://.../${actor}` }} // Replace with the proper image URL
                  className="w-16 h-24 rounded-lg"
                />
                <AppText
                  text={actor}
                  isDarkTheme={isDarkTheme}
                  customStyle="text-center text-sm"
                />
                <AppText
                  text="Actor/Actress"
                  isDarkTheme={isDarkTheme}
                  customStyle="text-center text-sm text-gray-400"
                />
              </View>
            ))}
            {movieDetailed.Director.split(",").map((director, index) => (
              <View key={index} className="mr-4">
                <Image
                  source={{ uri: `https://.../${director}` }} // Replace with the proper image URL
                  className="w-16 h-24 rounded-lg"
                />
                <AppText
                  text={director}
                  isDarkTheme={isDarkTheme}
                  customStyle="text-center text-sm"
                />
                <AppText
                  text="Director"
                  isDarkTheme={isDarkTheme}
                  customStyle="text-center text-sm text-gray-400"
                />
              </View>
            ))}
            {movieDetailed.Writer.split(",").map((writer, index) => (
              <View key={index} className="mr-4">
                <Image
                  source={{ uri: `https://.../${writer}` }} // Replace with the proper image URL
                  className="w-16 h-24 rounded-lg"
                />
                <AppText
                  text={writer}
                  isDarkTheme={isDarkTheme}
                  customStyle="text-center text-sm"
                />
                <AppText
                  text="Writer"
                  isDarkTheme={isDarkTheme}
                  customStyle="text-center text-sm text-gray-400"
                />
              </View>
            ))}
          </ScrollView>
          {/* User Reviews */}
          <AppText
            text="User Reviews (from IMDB)"
            isDarkTheme={isDarkTheme}
            customStyle="text-lg font-semibold mb-2"
          />
          <AppText
            text="Justice League is, unfortunately, plagued with post-production issues..."
            isDarkTheme={isDarkTheme}
            customStyle="text-gray-800 mb-4"
          />
          <View className="flex-row justify-between w-full max-w-xs mb-24">
            <TouchableOpacity className="flex-1 items-center">
              <Text className="text-gray-500">LIKE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addFavorite}
              className="flex-1 items-center"
              style={{ height: 50 }}
            >
              <Text className="text-gray-500">FAVORITE</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center">
              <Text className="text-gray-500">SHARE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default movieDetails;
