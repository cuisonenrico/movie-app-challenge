import { useTheme } from "../context/themeContext";
import AppText from "./components/app_text";
import AppSafeAreaView from "./components/app_safe_area_view";
import AppStatusBar from "./components/app_status_bar";
import { FlatList, Text, ActivityIndicator, View, Image } from "react-native";
import AppGridItem from "./components/app_grid_item";
import { useState } from "react";
import axios from "axios";
import { Movie } from "@/models/movie";
import { Link } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import DebouncedTextInput from "./components/debouncing_input";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Heart } from "lucide-react-native";

export default function MovieHome() {
  const { theme, toggleTheme, enableSystemTheme, useSystem } = useTheme();

  var isDarkTheme = theme === "dark";

  const [page, setPage] = useState(1); // Tracks current page for pagination
  const [trackedQuery, setQuery] = useState("Marvel"); // Maintains query parameter for on end scroll request
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("movie");
  const [year, selectedYear] = useState("");

  const [typeItems, setTypeItems] = useState([
    { label: "Movie", value: "movie" },
    { label: "Series", value: "series" },
    { label: "Episode", value: "episode" },
  ]);

  const fetchMovies = async (query: string, hasChanged: boolean) => {
    try {
      setLoading(true);

      const apiKey = process.env.EXPO_PUBLIC_API_KEY;

      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&type=${selectedType}&y=${year}&page=${page}`
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

  if (error) return <Text className="text-red-500">Error: {error}</Text>;

  return (
    <AppSafeAreaView isDarkTheme={isDarkTheme}>
      <AppStatusBar isDarkTheme={isDarkTheme} />
      {/* <AppButton
        label="system"
        onPress={enableSystemTheme}
        isDarkTheme={isDarkTheme}
      /> */}
      <View className="flex-1">
        <FlatList
          // data={Array.from(new Set(movies))}
          data={movies.filter(
            (item, index, self) =>
              index === self.findIndex((obj) => obj.imdbID === item.imdbID)
          )}
          renderItem={({ item }) => <AppGridItem item={item} />}
          keyExtractor={(item) => item.Poster}
          numColumns={2} // Ensures at least 2 per row
          horizontal={false} // Restricts horizontal scrolling (default)
          scrollEnabled={true} // Ensures vertical scrolling works
          onEndReached={onEndScroll} // Load more when reaching the bottom
          onEndReachedThreshold={0.5} // Load when 50% of the screen remains
          ListHeaderComponent={() => (
            <View>
              <View className="flex flex-row justify-between pr-4 pl-4 pt-4 w-screen space-x-5 mb-3">
                <AppText
                  text="MotionMe App"
                  isDarkTheme={isDarkTheme}
                  customStyle="text-3xl font-bold"
                />

                <Link href={"/favorites"}>
                  <Heart className="p-4" size={24} color={"red"} fill={"red"} />
                </Link>
              </View>
              <View className="flex-row w-full items-center ">
                <DebouncedTextInput hint="Search" onSearch={fetchMovies} />
                <DebouncedTextInput
                  hint="Year"
                  onSearch={(query) => {
                    selectedYear(query);
                    fetchMovies(trackedQuery, true);
                  }}
                />
              </View>
              <View
                className={`p-2 text-lg  ${
                  isDarkTheme ? "text-white" : "text-black"
                }`}
                style={{
                  elevation: 5,
                  marginBottom: typeDropdownOpen == true ? 105 : 0,
                }}
              >
                <DropDownPicker
                  onSelectItem={() => {
                    fetchMovies(trackedQuery, true);
                  }}
                  open={typeDropdownOpen}
                  value={selectedType}
                  items={typeItems}
                  setOpen={setTypeDropdownOpen}
                  setValue={setSelectedType}
                  setItems={setTypeItems}
                  textStyle={{
                    fontSize: 18,
                    color: isDarkTheme ? "white" : "black",
                  }}
                  ArrowDownIconComponent={() => {
                    return (
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color={isDarkTheme ? "white" : "black"}
                      /> // Custom Arrow Color
                    ); // Custom Arrow Color
                  }}
                  ArrowUpIconComponent={() => {
                    return (
                      <MaterialIcons
                        name="arrow-drop-up"
                        size={24}
                        color={isDarkTheme ? "white" : "black"}
                      /> // Custom Arrow Color
                    ); // Custom Arrow Color
                  }}
                  style={{
                    backgroundColor: isDarkTheme ? "bg-white" : "bg-black",
                    height: 40,
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#eaeaea", // Light grey border
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: isDarkTheme ? "bg-white" : "bg-black",
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: "#eaeaea", // Light grey border
                    zIndex: 5000,
                  }}
                />
              </View>
            </View>
          )}
          ListFooterComponent={
            loading ? (
              <ActivityIndicator
                className={`flex-1 items-center justify-center ${
                  isDarkTheme ? "bg-black" : "white"
                }`}
                size="large"
                color="#0000ff"
              />
            ) : null
          }
        />
      </View>
    </AppSafeAreaView>
  );
}
