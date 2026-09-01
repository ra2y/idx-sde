import { useEffect, useState } from "react";

const STORAGE_KEY = "idx-favorites";

function getInitialFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function useFavorites() {
  const [favorites, setFavorites] = useState(getInitialFavorites);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  function isFavorite(listingId) {
    return favorites.some(
      (property) => property.L_ListingID === listingId
    );
  }

  function addFavorite(property) {
    setFavorites((current) => {
      const alreadyExists = current.some(
        (favorite) =>
          favorite.L_ListingID === property.L_ListingID
      );

      if (alreadyExists) {
        return current;
      }

      return [...current, property];
    });
  }

  function removeFavorite(listingId) {
    setFavorites((current) =>
      current.filter(
        (property) => property.L_ListingID !== listingId
      )
    );
  }

  function toggleFavorite(property) {
    if (isFavorite(property.L_ListingID)) {
      removeFavorite(property.L_ListingID);
    } else {
      addFavorite(property);
    }
  }

  return {
    favorites,
    favoritesCount: favorites.length,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
}

export default useFavorites;