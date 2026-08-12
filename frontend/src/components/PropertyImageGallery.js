import { useState } from "react";
import { parsePhotos } from "../utils/photos";
import "./PropertyImageGallery.css";

function PropertyImageGallery({ photosValue }) {
  const photos = parsePhotos(photosValue);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (photos.length === 0) {
    return <p>No property photos available.</p>;
  }

  function previous() {
    setCurrentIndex((current) =>
      current === 0 ? photos.length - 1 : current - 1
    );
  }

  function next() {
    setCurrentIndex((current) =>
      current === photos.length - 1 ? 0 : current + 1
    );
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setLightboxOpen(false);
    }

    if (event.key === "ArrowLeft") {
      previous();
    }

    if (event.key === "ArrowRight") {
      next();
    }
  }

  return (
    <>
      <section className="gallery">
        <img
          className="gallery__main"
          src={photos[currentIndex]}
          alt={`Property ${currentIndex + 1}`}
          onClick={() => setLightboxOpen(true)}
        />

        <div className="gallery__thumbnails">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={`${photo}-${index}`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={photo}
                alt={`Thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      </section>

      {lightboxOpen && (
        <div
          className="lightbox"
          role="dialog"
          tabIndex={0}
          autoFocus
          onKeyDown={handleKeyDown}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              className="lightbox__previous"
              onClick={(event) => {
                event.stopPropagation();
                previous();
              }}
            >
              ‹
            </button>
          )}

          <img
            src={photos[currentIndex]}
            alt={`Property ${currentIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
          />

          {photos.length > 1 && (
            <button
              type="button"
              className="lightbox__next"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default PropertyImageGallery;