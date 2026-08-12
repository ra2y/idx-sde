function PropertyMap({ latitude, longitude }) {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat === 0 ||
    lng === 0
  ) {
    return <p>Map location unavailable.</p>;
  }

  if (!apiKey) {
    return <p>Google Maps API key is not configured.</p>;
  }

  const mapUrl =
    `https://www.google.com/maps/embed/v1/place` +
    `?key=${encodeURIComponent(apiKey)}` +
    `&q=${lat},${lng}` +
    `&zoom=15`;

  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${lat},${lng}`;

  return (
    <section>
      <h2>Location</h2>

      <iframe
        title="Property location"
        src={mapUrl}
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
      />

      <p>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
        >
          Get Directions
        </a>
      </p>
    </section>
  );
}

export default PropertyMap;