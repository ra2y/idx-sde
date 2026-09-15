import { useEffect, useRef, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";
import SortControls from "../components/SortControls";
import "./ListingsPage.css";
import useFavorites from "../hooks/useFavorites";
import { Link } from "react-router-dom";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);

  const ITEMS_PER_PAGE = 20;

  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const {
    favoritesCount,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  async function loadProperties(filters = {}) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");

      const offset = (currentPage - 1) * ITEMS_PER_PAGE;

      const data = await fetchProperties(
        {
          ...filters,
          limit: ITEMS_PER_PAGE,
          offset,
          sortBy,
          sortOrder,
        },
        {
          signal: controller.signal,
        }
      );
      setProperties(
        Array.isArray(data?.results) ? data.results : []
      );
      setTotal(Number(data?.total) || 0);
    } catch (requestError) {
      if (requestError.name === "AbortError") {
        return;
      }

      setProperties([]);
      setTotal(0);
      setError(requestError.message || "Unable to load properties.");
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadProperties(activeFilters);

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [currentPage, activeFilters, sortBy, sortOrder]);

  function handleSearch(filters) {
    setCurrentPage(1);
    setSortBy("");
    setSortOrder("asc");
    setActiveFilters(filters);
  }

  function handleClear() {
    setCurrentPage(1);
    setSortBy("");
    setSortOrder("asc");
    setActiveFilters({});
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  function handleSortChange(newSortBy, newSortOrder) {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  }

  const start =
    total === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const end = Math.min(
    currentPage * ITEMS_PER_PAGE,
    total
  );

  return (
    <main className="listings-page">
    <header className="listings-page__header">
      <h1>Property Listings</h1>

      <p>
        Showing {start}-{end} of {total} properties
      </p>

      <nav className="listings-nav">
        <Link to="/favorites">
          Favorites ({favoritesCount})
        </Link>

        <Link to="/openhouses">
          Open House Calendar
        </Link>
      </nav>
    </header>

      <PropertyFilters
        onSearch={handleSearch}
        onClear={handleClear}
        disabled={loading}
      />

      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {Object.keys(activeFilters).length > 0 && (
        <p className="active-filter-summary">
          Active filters:{" "}
          {Object.entries(activeFilters)
            .map(([key, value]) => `${key}=${value}`)
            .join(", ")}
        </p>
      )}

      {loading && (
        <p className="status-message">Loading properties...</p>
      )}

      {!loading && error && (
        <section className="error-message">
          <h2>Unable to load properties</h2>
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && properties.length === 0 && (
        <p className="status-message">
          No properties matched your filters. Try broadening your search.
        </p>
      )}

      {!loading && !error && properties.length > 0 && (
        <section className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id || property.L_ListingID}
              property={property}
              isFavorite={isFavorite(property.L_ListingID)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </section>
      )}
      {!loading && !error && (
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}

export default ListingsPage;