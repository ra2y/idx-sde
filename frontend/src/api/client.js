export async function fetchProperties(params = {}, options = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = queryString
    ? `/api/properties?${queryString}`
    : "/api/properties";

  const response = await fetch(url, {
    signal: options.signal,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const body = await response.json();

      if (body.message) {
        message = body.message;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}
export async function fetchPropertyDetail(id) {
  const response = await fetch(
    `/api/properties/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    let message = "Unable to load property";

    try {
      const body = await response.json();

      if (body.message) {
        message = body.message;
      }
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}
export async function fetchOpenHouses(id) {
  const response = await fetch(
    `/api/properties/${encodeURIComponent(id)}/openhouses`
  );

  if (!response.ok) {
    let message = "Unable to load open houses";

    try {
      const body = await response.json();

      if (body.message) {
        message = body.message;
      }
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}