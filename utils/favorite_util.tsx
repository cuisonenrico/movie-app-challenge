import { Movie } from "@/models/movie";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const addFavorite = async (movie: Movie) => {
  var favorites;
  var isFavorite;
  try {
    const storedMovies = await AsyncStorage.getItem("favoriteMovies");
    const moviesList = storedMovies ? JSON.parse(storedMovies) : [];

    const uniqueMovies = moviesList.filter(
      (movie: { imdbID: string }, index: any, self: any[]) =>
        index === self.findIndex((m) => m.imdbID === movie.imdbID)
    );

    favorites = uniqueMovies;

    isFavorite = favorites.some(
      (favorite: { imdbID: string }) => favorite.imdbID == movie.imdbID
    );

    if (!isFavorite) {
      try {
        // Get existing list from AsyncStorage
        const storedMovies = await AsyncStorage.getItem("favoriteMovies");

        // Parse it (or default to an empty array if null)
        const moviesList = storedMovies ? JSON.parse(storedMovies) : [];

        // Add the new movie to the list
        const newUpdatedMovies = Array.from(new Set([...moviesList, movie]));

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
    } else {
      // Make sure it is unique and remove the selected item
      const uniqueMovies = favorites.filter(
        (fav: { imdbID: string }) => fav.imdbID !== movie.imdbID
      );

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem(
        "favoriteMovies",
        JSON.stringify(uniqueMovies)
      );
    }
  } catch (error) {
    console.error("Error retrieving movies:", error);
  }
};

export const isInFavorites = async (movie: Movie): Promise<boolean> => {
  var isFavorite;
  try {
    const storedFavorites = await AsyncStorage.getItem("favoriteMovies");
    const moviesList = JSON.parse(storedFavorites!);

    const favoriteMovies = moviesList.filter(
      (movie: { imdbID: string }, index: any, self: any[]) =>
        index === self.findIndex((m) => m.imdbID === movie.imdbID)
    );

    isFavorite = favoriteMovies.some(
      (favorite: { imdbID: any }) => favorite.imdbID == movie.imdbID
    );

    return isFavorite;
  } catch (error) {
    console.error("Error retrieving movies:", error);
    return false;
  }
};
