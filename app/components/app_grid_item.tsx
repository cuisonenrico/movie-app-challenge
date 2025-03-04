import { View, Text, Dimensions, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Movie } from "@/models/movie";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Heart } from "lucide-react-native"; // Lucide icons are lightweight
import { addFavorite, isInFavorites } from "@/utils/favorite_util";

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

  const router = useRouter();

  const handlePress = async () => {
    await AsyncStorage.setItem("selectedMovie", JSON.stringify(item)); // Save to AsyncStorage
    router.push("/movieDetails");
  };

  const runFavoritesCheck = async () => {
    const isFav = await isInFavorites(item);
    setIsFavorite(isFav);
  };
  const addFavoriteLocal = async () => {
    if (item == null) return;
    await addFavorite(item);
    runFavoritesCheck();
  };

  const favoriteIcon = () => {
    if (showFavoriteIcon) {
      return (
        <TouchableOpacity
          className="absolute top-8 right-4 p-1 rounded-full bg-white"
          onPress={(e) => {
            e.stopPropagation();
            addFavoriteLocal();
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

  useEffect(() => {
    runFavoritesCheck();
  }, [item, isFavorite]);

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
