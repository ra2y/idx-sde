import { useEffect, useRef, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import "./ListingsPage.css";

const DEFAULT_LIMIT = 20;

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);

  async function loadProperties(filters = {}) {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError("");

      const data = await fetchProperties(
        {
          ...filters,
          limit: DEFAULT_LIMIT,
          offset: 0,
        },
        {
          signal: controller.signal,
        }
      );

      setProperties(Array.isArray(data.results) ? data.results : []);
      setTotal(Number(data.total) || 0);
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
    loadProperties();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  function handleSearch(filters) {
    setActiveFilters(filters);
    loadProperties(filters);
  }

  function handleClear() {
    setActiveFilters({});
    loadProperties({});
  }

  return (
    <main className="listings-page">
      <header className="listings-page__header">
        <h1>Property Listings</h1>

        <p>
          Showing {properties.length} of {total} properties
        </p>
      </header>

      <PropertyFilters
        onSearch={handleSearch}
        onClear={handleClear}
        disabled={loading}
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
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default ListingsPage;