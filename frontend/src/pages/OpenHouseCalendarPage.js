export async function fetchOpenHouseCalendar(startDate, endDate) {
  const params = new URLSearchParams({
    startDate,
    endDate,
  });

  const response = await fetch(
    `/api/openhouses?${params.toString()}`
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