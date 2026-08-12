import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchOpenHouses,
  fetchPropertyDetail,
} from "../api/client";

import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
import OpenHouseList from "../components/OpenHouseList";

import "./PropertyDetailPage.css";

function formatPrice(price) {
  const value = Number(price);

  if (!Number.isFinite(value) || value <= 0) {
    return "Price unavailable";
  }

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        setError("");

        const [propertyData, openHouseData] =
          await Promise.all([
            fetchPropertyDetail(id),
            fetchOpenHouses(id),
          ]);

        setProperty(propertyData);

        setOpenHouses(
          Array.isArray(openHouseData)
            ? openHouseData
            : []
        );
      } catch (requestError) {
        setError(
          requestError.message ||
            "Unable to load property."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  if (loading) {
    return (
      <main className="property-detail">
        <p>Loading property...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="property-detail">
        <button onClick={() => navigate("/")}>
          Back to Listings
        </button>

        <h1>Unable to load property</h1>

        <p>{error}</p>
      </main>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <main className="property-detail">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <PropertyImageGallery
        photosValue={property.L_Photos}
      />

      <section className="property-detail__header">
        <h1>
          {formatPrice(property.L_SystemPrice)}
        </h1>

        <h2>
          {property.L_Address || "Address unavailable"}
        </h2>

        <p>
          {[property.L_City, property.L_State, property.L_Zip]
            .filter(Boolean)
            .join(", ")}
        </p>

        <div className="property-stats">
          <span>
            {property.L_Keyword2 ?? "-"} beds
          </span>

          <span>
            {property.LM_Dec_3 ?? "-"} baths
          </span>

          <span>
            {property.LM_Int2_3 ?? "-"} sqft
          </span>

          <span>
            Built {property.YearBuilt ?? "N/A"}
          </span>
        </div>
      </section>

      <section>
        <h2>Description</h2>

        <p>
          {property.L_Remarks ||
            "No property description available."}
        </p>
      </section>

      <section>
        <h2>Property Details</h2>

        <dl>
          <dt>Listing ID</dt>
          <dd>{property.L_ListingID}</dd>

          <dt>Year Built</dt>
          <dd>{property.YearBuilt ?? "N/A"}</dd>

          <dt>Lot Size</dt>
          <dd>
            {property.LotSizeAcres
              ? `${property.LotSizeAcres} acres`
              : "N/A"}
          </dd>

          <dt>Days on Market</dt>
          <dd>{property.DaysOnMarket ?? "N/A"}</dd>

          <dt>Property Type</dt>
          <dd>{property.L_Type_ ?? "N/A"}</dd>
        </dl>
      </section>

      <PropertyMap
        latitude={property.LMD_MP_Latitude}
        longitude={property.LMD_MP_Longitude}
      />

      <section>
        <h2>Open Houses</h2>

        <OpenHouseList openHouses={openHouses} />
      </section>
    </main>
  );
}

export default PropertyDetailPage;