function getRemarks(openHouse) {
  if (!openHouse.all_data) {
    return "";
  }

  if (
    typeof openHouse.all_data === "object" &&
    openHouse.all_data !== null
  ) {
    return openHouse.all_data.OpenHouseRemarks || "";
  }

  try {
    const data = JSON.parse(openHouse.all_data);
    return data.OpenHouseRemarks || "";
  } catch {
    return "";
  }
}

function formatDate(value) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
}

function formatTime(value) {
  if (!value) {
    return "";
  }

  const pieces = String(value).split(":");

  if (pieces.length < 2) {
    return value;
  }

  const date = new Date();

  date.setHours(
    Number(pieces[0]),
    Number(pieces[1]),
    0,
    0
  );

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function OpenHouseList({ openHouses }) {
  if (!openHouses || openHouses.length === 0) {
    return <p>No open houses scheduled.</p>;
  }

  return (
    <div>
      {openHouses.map((openHouse, index) => (
        <article
          className="open-house"
          key={openHouse.id || index}
        >
          <strong>
            {formatDate(openHouse.OpenHouseDate)}
          </strong>

          <p>
            {formatTime(openHouse.OH_StartTime)}
            {" - "}
            {formatTime(openHouse.OH_EndTime)}
          </p>

          {getRemarks(openHouse) && (
            <p>{getRemarks(openHouse)}</p>
          )}
        </article>
      ))}
    </div>
  );
}

export default OpenHouseList;