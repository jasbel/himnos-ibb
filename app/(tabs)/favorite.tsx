import { StyleSheet, FlatList } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import HimnoItem from "@/components/himno/HimnoItem";
import { songs } from "@/res/letters";
import { Songs } from "@/types/types";
import { useState, useEffect } from "react";
import Storage from "@/libs/storage";
import Colors from "@/res/colors";

export default function TabTwoScreen() {
  const data = songs;

  const [favorites, setFavorites] = useState<Songs[]>([]);

  const getFavoriteData = async () => {
    try {
      const allKeys = await Storage.instance.getAllKeys();
      const keys = allKeys.filter((key: string | string[]) => key.includes("favorite-"));
      const favs = await Storage.instance.multiGet(keys);
      const cFavorites = favs.map((fav: string[]) => JSON.parse(fav[1]));

      setFavorites(cFavorites);
    } catch (error) {
      console.log("Get Favorites Err", error);
    }
  };

  const handlePress = (himno: Songs) => {
    /* navigato to himno */
  };

  useEffect(() => {
    // navigation.setOptions({
    //   title: titleApp,
    //   headerTitleStyle: {
    //     fontWeight: 'bold',
    //     textTransform: 'uppercase',
    //     fontSize: responsive(23, 20),
    //   },
    // });
    // const unsubscribe = navigation.addListener('focus', () => getHimnos());
    // return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps

    getFavoriteData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <FlatList
        style={styles.contentItems}
        data={favorites}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ThemedView>
            {/* {!modeSearch && index === 0 && <FavoriteScreen navigation={navigation} favorites={favorites} />} */}

            <HimnoItem key={item.id} item={item} onPress={() => handlePress(item)} />
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bkgWhite,
    paddingLeft: 12,
    paddingRight: 12,
  },
  contentItems: {
    paddingTop: 12,
  },
});
