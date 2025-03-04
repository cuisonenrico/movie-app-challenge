import { View, Text, Dimensions, Image } from "react-native";
import React from "react";
import { Movie } from "@/models/movie";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppGridItem = ({ item }: { item: Movie }) => {
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth / 2 - 20; // 2 columns with margin

  const router = useRouter();
  const handlePress = async () => {
    await AsyncStorage.setItem("selectedMovie", JSON.stringify(item)); // Save to AsyncStorage
    router.push("/movieDetails");
  };

  return (
    <Link
      onPress={handlePress}
      className="flex-4 m-2 p-1 rounded-lg items-center"
      style={{ width: itemWidth }}
      href="/movieDetails"
    >
      <View
        className="flex-4 m-2 p-1 rounded-lg items-center"
        style={{ width: itemWidth }}
      >
        <Image
          className="rounded-lg"
          source={{ uri: item.Poster }}
          style={{ width: itemWidth, height: 300, marginVertical: 0 }}
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
          <Text className="text-white font-bold text-center">{item.Title}</Text>
        </View>
      </View>
    </Link>
  );
};

export default AppGridItem;
