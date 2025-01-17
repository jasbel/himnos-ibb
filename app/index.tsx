import { Link, Stack, useNavigation, useRouter } from "expo-router";
import { StyleSheet, Text, FlatList, View } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import FavoriteScreen from "@/components/favorite/FavoriteScreen";
import HimnoItem from "@/components/himno/HimnoItem";
import HimnoSearch from "@/components/himno/HimnoSearch";
import Colors from "@/res/colors";
import { useEffect, useState } from "react";
import { songs } from "@/res/letters";
import Storage from "@/libs/storage";
import { removeAccents } from "@/res/removeAccents";
import { Songs } from "@/types/types";
import { responsive, widthScreen } from "@/res/responsive";
import { titleApp } from "@/res/constant";

export default function HimnosScreen(props: { navigation: any }) {
  const data = songs;

  // const  navigation = useRouter();
  const navigation = useNavigation();
  const [dataSearch, setDataSearch] = useState(songs);
  const [noFavoritesData, setNoFavoriteData] = useState<Songs[]>(songs);
  const [favorites, setFavorites] = useState([] as any);
  const [modeSearch, setModeSearch] = useState(false);

  const getHimnos = async () => {
    try {
      const allKeys = await Storage.instance.getAllKeys();
      const keys = allKeys.filter((key: string | string[]) => key.includes("favorite-"));
      const favs = await Storage.instance.multiGet(keys);
      const cFavorites = favs.map((fav: string[]) => JSON.parse(fav[1]));

      const dataNotFavorite = data.filter(himnoItem => {
        const himno = cFavorites.filter((itemFav: { id: string }) => {
          return itemFav.id === himnoItem.id;
        });

        return himno.length ? false : true;
      });
      setFavorites(cFavorites);
      setNoFavoriteData(dataNotFavorite);
    } catch (error) {
      console.log("Get Favorites Err", error);
    }
  };

  const handlePress = (himno: Songs) => {
    // navigation.setParams({himno: `${himno}`});
    /* @ts-ignore */
    navigation.navigate({
      name: "himno",
      params: {
        himno: himno,
        himnoStr: JSON.stringify(himno),
      },
    });
    // navigation.navigate('details', { itemId: 42, otherParam: 'anything you want here' })
    setModeSearch(false);
  };

  const handleSearch = (query: string) => {
    query && !modeSearch && setModeSearch(true);
    !query && setModeSearch(false);

    const HimnosFiltered = data.filter(himno => {
      return (
        removeAccents(himno.title_es).toLowerCase().includes(removeAccents(query).toLowerCase()) ||
        removeAccents(himno.description_es).toLowerCase().includes(removeAccents(query).toLowerCase())
      );
    });

    setDataSearch(HimnosFiltered);

    !query && getHimnos();
  };

  useEffect(() => {
    navigation.setOptions({
      title: titleApp,
      headerTitleStyle: {
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: responsive(23, 20),
      },
    });
    const unsubscribe = navigation.addListener("focus", () => getHimnos());
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => getHimnos());
  //   return () => {
  //     unsubscribe;
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [navigation]);

  return (
    <View style={styles.container}>
      <HimnoSearch onChange={handleSearch} modeSearch={modeSearch} />

      <FlatList
        style={styles.contentItems}
        data={!modeSearch ? noFavoritesData : dataSearch}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View>
            {!modeSearch && index === 0 && <FavoriteScreen navigation={navigation} favorites={favorites} />}

            <HimnoItem key={item.id} item={item} onPress={() => handlePress(item)} />
          </View>
        )}
      />

      {!noFavoritesData.length && <FavoriteScreen navigation={navigation} favorites={favorites} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    backgroundColor: Colors.bkgWhite,
    paddingLeft: 12,
    paddingRight: 12,
  },
  contentItems: {
    paddingTop: 12,
  },
});
