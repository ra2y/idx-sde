export async function fetchProperties(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();

  const url = queryString
    ? `/api/properties?${queryString}`
    : "/api/properties";

  const response = await fetch(url);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = await response.json();

      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Response was not JSON, so retain the default message.
    }

    throw new Error(message);
  }

  return response.json();
}