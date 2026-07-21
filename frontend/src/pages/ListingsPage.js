import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import "./ListingsPage.css";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProperties() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProperties({
          limit: 20,
          offset: 0,
        });

        if (!ignore) {
          setProperties(
            Array.isArray(data.results) ? data.results : []
          );

          setTotal(Number(data.total) || 0);
        }
      } catch (requestError) {
        if (!ignore) {
          setProperties([]);
          setTotal(0);
          setError(
            requestError.message || "Unable to load properties."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProperties();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="listings-page">
        <p className="status-message">Loading properties...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="listings-page">
        <section className="error-message">
          <h1>Unable to load properties</h1>
          <p>{error}</p>
          <p>Make sure the Express server and MySQL container are running.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="listings-page">
      <header className="listings-page__header">
        <h1>Property Listings</h1>

        <p>
          Showing {properties.length} of {total} properties
        </p>
      </header>

      {properties.length === 0 ? (
        <p className="status-message">No properties found.</p>
      ) : (
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