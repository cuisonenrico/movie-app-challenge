import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";
import { useTheme } from "../context/themeContext";
import AppText from "./components/app_text";
import AppSafeAreaView from "./components/app_safe_area_view";
import AppStatusBar from "./components/app_status_bar";
import axios from "axios";
import { Movie } from "@/models/movie";
import { MovieDetailed } from "@/models/movie_detailed";
import { Heart, Share2, ThumbsUp } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addFavorite, isInFavorites } from "@/utils/favorite_util";

const movieDetails = () => {
  const { theme } = useTheme();

  const isDarkTheme = theme === "dark";
  const screenSize = Dimensions.get("window");

  const [movie, setMovie] = useState<Movie>();
  const [movieDetailed, setMovieDetailed] = useState<MovieDetailed>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const addFavoriteLocal = async () => {
    if (movie == null) return;
    await addFavorite(movie);
    const isFavorite = await isInFavorites(movie);
    setIsFavorite(isFavorite);
  };

  const loadMovie = async () => {
    const storedMovie = await AsyncStorage.getItem("selectedMovie");

    if (storedMovie) {
      var movieObj = JSON.parse(storedMovie);
      setMovie(movieObj);

      try {
        const apiKey = process.env.EXPO_PUBLIC_API_KEY;

        const response = await axios.get(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieObj["imdbID"]}&plot=full`
        );
        setMovieDetailed(response.data);
      } catch (err) {
        setError(error);
      } finally {
        if (movie == null) return;
        const isFav = await isInFavorites(movie);
        setIsFavorite(isFav);
        setLoading(false);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMovie();
  }, [movie, movieDetailed]);

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

  const openMediaPlayer = () => {
    const mediaUrl = "s"; // Replace with your media file URL
    Linking.openURL(mediaUrl).catch((err) =>
      console.error("Couldn't open media player", err)
    );
  };

  return (
    <AppSafeAreaView isDarkTheme={isDarkTheme}>
      <AppStatusBar isDarkTheme={isDarkTheme} />
      <ScrollView
        className={`${isDarkTheme ? "bg-black" : "bg-white"}`}
        style={{ width: screenSize.width, height: screenSize.height }}
      >
        <View className="relative w-full h-700">
          <TouchableOpacity activeOpacity={0.8} onPress={openMediaPlayer}>
            <Image
              resizeMethod="scale"
              resizeMode="cover"
              source={
                imageError
                  ? require("../assets/placeholder.png") // Local placeholder image
                  : { uri: movieDetailed.Poster }
              }
              onError={() => setImageError(true)}
              style={{ width: screenSize.width, height: 500 }}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-row relative -top-14 bottom-0 left-0 right-0 bg-transparent flex-row items-center p-4">
          <Image
            className="w-20 h-30 rounded-lg"
            resizeMode="cover"
            source={
              imageError
                ? require("../assets/placeholder.png") // Local placeholder image
                : { uri: movieDetailed.Poster }
            }
            onError={() => setImageError(true)}
            style={{ width: 100, height: 180, marginVertical: 0 }}
          />
          <View className="flex-1 relative mt-12 ml-4 bottom-0">
            <AppText
              text={movieDetailed.Title}
              isDarkTheme={isDarkTheme}
              customStyle="flex-wrap-reverse flex text-2xl font-bold mr-12 "
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
              <View key={index} className="mr-4 items-center">
                <Image
                  resizeMode="cover"
                  source={require("../assets/placeholder.png")}
                  className="w-24 h-24 rounded-lg"
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
              <View key={index} className="mr-4 items-center">
                <Image
                  resizeMode="cover"
                  source={require("../assets/placeholder.png")}
                  className="w-24 h-24 rounded-lg"
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
              <View key={index} className="mr-4 items-center">
                <Image
                  resizeMode="cover"
                  source={require("../assets/placeholder.png")}
                  onError={() => setImageError(true)}
                  className="w-24 h-24 rounded-lg"
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
          <View className="mt-8">
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
          </View>
          <View className="flex-row justify-center w-full mb-24 mt-12 items-center align-center">
            <TouchableOpacity
              onPress={() => {}}
              className={`flex-1 items-center justify-center ${
                isDarkTheme ? "bg-black" : "bg-white"
              }`}
              style={{ height: 50 }}
            >
              <ThumbsUp size={24} color={isDarkTheme ? "white" : "gray"} />
              <Text className="text-gray-500 mt-1">LIKE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addFavoriteLocal}
              className={`flex-1 items-center justify-center ${
                isDarkTheme ? "bg-black" : "bg-white"
              }`}
              style={{ height: 50 }}
            >
              <Heart
                size={24}
                color={
                  isFavorite ? "red" : `${isDarkTheme ? "white" : "black"}`
                }
                fill={isFavorite ? "red" : "transparent"}
              />
              <Text className="text-gray-500 mt-1">FAVORITE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              className={`flex-1 items-center justify-center ${
                isDarkTheme ? "bg-black" : "bg-white"
              }`}
              style={{ height: 50 }}
            >
              <Share2 size={24} color={isDarkTheme ? "white" : "gray"} />
              <Text className="text-gray-500 mt-1">SHARE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default movieDetails;
