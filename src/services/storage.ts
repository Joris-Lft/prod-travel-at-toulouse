import * as infos from "../../package.json";
import { Favorite } from "../types";

export const addFavorite = async (data: Favorite) => {
  try {
    const favorites = await localStorage.getItem(infos.name);
    let jsonFavorites = [];
    if (favorites) {
      jsonFavorites = JSON.parse(favorites as string);
    }

    // check if favorite is not saved yet
    const isAlreadySaved = jsonFavorites.find(
      (e: Favorite) =>
        e.selectedLine.shortName === data.selectedLine.shortName &&
        e.selectedStopPlace.name === data.selectedStopPlace.name &&
        e.selectedStopPlace.destinations[0].name ===
          data.selectedStopPlace.destinations[0].name,
    );
    if (isAlreadySaved) {
      return;
    }

    // handle 4 favorites max
    if (jsonFavorites.length >= 4) {
      jsonFavorites.splice(0, 1);
    }

    jsonFavorites.push(data);

    const stringifyData = JSON.stringify(jsonFavorites);
    await localStorage.setItem(infos.name, stringifyData);
  } catch (e) {
    console.error("Failed to save favorite", e);
  }
};

export const getFavorite = async () => {
  try {
    const data = await localStorage.getItem(infos.name);
    return JSON.parse(data as string);
  } catch (e) {
    console.error("Failed to retrieve favorite");
  }
};

export const removeFavorites = async (favorite: Favorite) => {
  const favorites = await localStorage.getItem(infos.name);
  const jsonFavorites = JSON.parse(favorites as string);
  const indexOfElement = jsonFavorites.findIndex(
    (e: Favorite) =>
      e.selectedLine.shortName === favorite.selectedLine.shortName &&
      e.selectedStopPlace.name === favorite.selectedStopPlace.name &&
      e.selectedStopPlace.destinations[0].name ===
        favorite.selectedStopPlace.destinations[0].name,
  );
  jsonFavorites.splice(indexOfElement, 1);
  const stringifyData = JSON.stringify(jsonFavorites);
  await localStorage.setItem(infos.name, stringifyData);
};
