import { useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";
import "./PropertyCard.css";

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Price unavailable";
  }

  return numericPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function displayStat(value, label) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return `${value} ${label}`;
}

function PropertyCard({ property }) {
  const navigate = useNavigate();

  const stats = [
    displayStat(property.L_Keyword2, "beds"),
    displayStat(property.LM_Dec_3, "baths"),
    displayStat(property.LM_Int2_3, "sqft"),
  ].filter(Boolean);

  const address =
    property.L_Address ||
    property.L_AddressStreet ||
    "Address unavailable";

  const cityState = [property.L_City, property.L_State]
    .filter(Boolean)
    .join(", ");

  function openProperty() {
    navigate(`/property/${property.L_ListingID}`);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      openProperty();
    }
  }

  return (
    <article
      className="property-card"
      onClick={openProperty}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <PropertyImageCarousel
        photosValue={property.L_Photos}
        address={address}
      />

      <div className="property-card__body">
        <h2 className="property-card__price">
          {formatPrice(property.L_SystemPrice)}
        </h2>

        <p className="property-card__address">{address}</p>

        <p className="property-card__location">
          {cityState || "Location unavailable"}
        </p>

        <p className="property-card__stats">
          {stats.length > 0
            ? stats.join(" • ")
            : "Property details unavailable"}
        </p>
      </div>
    </article>
  );
}

export default PropertyCard;