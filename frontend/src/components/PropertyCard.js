import "./PropertyCard.css";

const FALLBACK_IMAGE =
  "https://placehold.co/600x400?text=No+Property+Photo";

function parsePhotos(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(
      (photo) => typeof photo === "string" && photo.trim() !== ""
    );
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (photo) => typeof photo === "string" && photo.trim() !== ""
    );
  } catch {
    return [];
  }
}

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
  const photos = parsePhotos(property.L_Photos);
  const firstPhoto = photos[0] || FALLBACK_IMAGE;

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

  return (
    <article className="property-card">
      <img
        className="property-card__image"
        src={firstPhoto}
        alt={address}
        onError={(event) => {
          event.currentTarget.src = FALLBACK_IMAGE;
        }}
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