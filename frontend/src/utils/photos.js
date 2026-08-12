export function parsePhotos(value) {
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