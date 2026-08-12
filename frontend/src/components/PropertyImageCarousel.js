import { useState } from "react";
import { parsePhotos } from "../utils/photos";
import "./PropertyImageCarousel.css";

const FALLBACK =
  "https://placehold.co/600x400?text=No+Property+Photo";

function PropertyImageCarousel({ photosValue, address }) {
  const photos = parsePhotos(photosValue);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayPhotos = photos.length > 0 ? photos : [FALLBACK];

  function previousPhoto(event) {
    event.stopPropagation();

    setCurrentIndex((current) =>
      current === 0 ? displayPhotos.length - 1 : current - 1
    );
  }

  function nextPhoto(event) {
    event.stopPropagation();

    setCurrentIndex((current) =>
      current === displayPhotos.length - 1 ? 0 : current + 1
    );
  }

  return (
    <div className="image-carousel">
      <img
        src={displayPhotos[currentIndex]}
        alt={address || "Property"}
        onError={(event) => {
          event.currentTarget.src = FALLBACK;
        }}
      />

      {displayPhotos.length > 1 && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-arrow--left"
            onClick={previousPhoto}
          >
            ‹
          </button>

          <button
            type="button"
            className="carousel-arrow carousel-arrow--right"
            onClick={nextPhoto}
          >
            ›
          </button>

          <span className="carousel-counter">
            {currentIndex + 1} / {displayPhotos.length}
          </span>
        </>
      )}
    </div>
  );
}

export default PropertyImageCarousel;