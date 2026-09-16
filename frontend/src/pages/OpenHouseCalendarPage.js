import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  momentLocalizer,
} from "react-big-calendar";

import moment from "moment";

import { fetchOpenHouseCalendar } from "../api/client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./OpenHouseCalendarPage.css";

const localizer = momentLocalizer(moment);

function parseRemarks(allData) {
  if (!allData) {
    return "";
  }

  if (typeof allData === "object") {
    return allData.OpenHouseRemarks || "";
  }

  try {
    const parsed = JSON.parse(allData);

    return parsed.OpenHouseRemarks || "";
  } catch {
    return "";
  }
}

function combineDateAndTime(dateValue, timeValue) {
  if (!dateValue) {
    return null;
  }

  const datePart = moment(dateValue).format("YYYY-MM-DD");

  const timePart = timeValue || "00:00:00";

  return new Date(`${datePart}T${timePart}`);
}

function OpenHouseCalendarPage() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOpenHouses = useCallback(async (date) => {
    try {
      setLoading(true);
      setError("");

      const startDate = moment(date)
        .startOf("month")
        .subtract(7, "days")
        .format("YYYY-MM-DD");

      const endDate = moment(date)
        .endOf("month")
        .add(7, "days")
        .format("YYYY-MM-DD");

      const data = await fetchOpenHouseCalendar(
        startDate,
        endDate
      );

      const calendarEvents = data
        .map((openHouse, index) => {
          const start = combineDateAndTime(
            openHouse.OpenHouseDate,
            openHouse.OH_StartTime
          );

          const end = combineDateAndTime(
            openHouse.OpenHouseDate,
            openHouse.OH_EndTime
          );

          if (!start || !end) {
            return null;
          }

          const address =
            openHouse.L_Address ||
            `Listing ${openHouse.L_ListingID}`;

          return {
            id:
              openHouse.id ||
              `${openHouse.L_ListingID}-${index}`,

            title: address,

            start,
            end,

            listingId: openHouse.L_ListingID,

            address: openHouse.L_Address,
            city: openHouse.L_City,
            state: openHouse.L_State,

            remarks: parseRemarks(
              openHouse.all_data
            ),
          };
        })
        .filter(Boolean);

      setEvents(calendarEvents);
    } catch (requestError) {
      setEvents([]);

      setError(
        requestError.message ||
          "Unable to load open houses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOpenHouses(currentDate);
  }, [currentDate, loadOpenHouses]);

  function handleNavigate(newDate) {
    setCurrentDate(newDate);
  }

  function handleSelectEvent(event) {
    navigate(`/property/${event.listingId}`);
  }

  return (
    <main className="openhouse-calendar-page">
      <header className="openhouse-calendar-header">
        <div>
          <h1>Open House Calendar</h1>

          <p>
            Browse upcoming open houses and click one
            to view the property.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Back to Listings
        </button>
      </header>

      {loading && (
        <p className="status-message">
          Loading open houses...
        </p>
      )}

      {error && (
        <section className="error-message">
          <h2>Unable to load open houses</h2>
          <p>{error}</p>
        </section>
      )}

      {!loading && !error && (
        <>
          {events.length === 0 && (
            <p className="calendar-empty-message">
              No open houses are scheduled in this
              date range.
            </p>
          )}

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            views={["month", "week", "day"]}
            defaultView="month"
            style={{
              height: 700,
            }}
          />
        </>
      )}
    </main>
  );
}

export default OpenHouseCalendarPage;