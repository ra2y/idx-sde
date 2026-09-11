import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import useFavorites from "../hooks/useFavorites";

function FavoritesPage() {
  const {
    favorites,
    favoritesCount,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  return (
    <main className="listings-page">
      <header className="listings-page__header">
        <h1>Favorite Properties</h1>

        <p>{favoritesCount} saved properties</p>

        <Link to="/">← Back to Listings</Link>
      </header>

      {favorites.length === 0 ? (
        <p className="status-message">
          You haven't saved any properties yet.
        </p>
      ) : (
        <section className="property-grid">
          {favorites.map((property) => (
            <PropertyCard
              key={
                property.id ||
                property.L_ListingID
              }
              property={property}
              isFavorite={isFavorite(
                property.L_ListingID
              )}
              onToggleFavorite={
                toggleFavorite
              }
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default FavoritesPage;