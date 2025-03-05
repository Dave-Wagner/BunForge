import React, { useState, useEffect, useMemo } from "react";
import FetchService from "@/services/fetcher";
import Logger from "@/services/logger";
import Icon from "@/components/Icon";
import { formatDate } from "@/utils";
// Import the global CSS styles.
import "@/styles/index.css";

const appLogger = new Logger({
  type: import.meta.env.VITE_LOGGER_TYPE || "console",
});

const App = () => {
  // State to hold the selected coordinates (latitude and longitude).
  const [coordinates, setCoordinates] = useState(null);
  // Form inputs for manual override.
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");

  // State for forecast URL and data.
  const [forecastUrl, setForecastUrl] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);

  // Memoize fetchService so its reference remains constant.
  const fetchService = useMemo(() => {
    return new FetchService({
      defaultOptions: {
        headers: { "User-Agent": "BunForge Weather App (contact@example.com)" },
      },
    });
  }, []);

  // Fetch user's geolocation by IP.
  useEffect(() => {
    const fetchGeolocation = async () => {
      try {
        appLogger.log("info", "Fetching geolocation by IP...");
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const coords = `${data.latitude},${data.longitude}`;
          appLogger.log("info", `Detected coordinates: ${coords}`);
          setCoordinates(coords);
          setLatInput(data.latitude);
          setLonInput(data.longitude);
        } else {
          throw new Error("Unable to determine location via IP.");
        }
      } catch (err) {
        appLogger.log("error", err.message);
        setError(err.message);
      }
    };

    fetchGeolocation();
  }, []);

  // Fetch point metadata using the current coordinates.
  useEffect(() => {
    if (!coordinates) return;

    const fetchPointData = async () => {
      try {
        appLogger.log("info", `Fetching point data for ${coordinates}`);
        const response = await fetchService.get(
          `https://api.weather.gov/points/${coordinates}`
        );
        const data = await response.json();
        appLogger.log("info", "Point data fetched successfully");
        if (data?.properties?.forecast) {
          setForecastUrl(data.properties.forecast);
          appLogger.log("info", `Forecast URL: ${data.properties.forecast}`);
        } else {
          throw new Error("Forecast URL not found in point data.");
        }
      } catch (err) {
        appLogger.log("error", err.message);
        setError(err.message);
      }
    };

    fetchPointData();
  }, [coordinates, fetchService]);

  // Fetch forecast data using the forecast URL.
  useEffect(() => {
    if (!forecastUrl) return;
    const fetchForecastData = async () => {
      try {
        appLogger.log("info", `Fetching forecast data from ${forecastUrl}`);
        const response = await fetchService.get(forecastUrl);
        const data = await response.json();
        appLogger.log("info", "Forecast data fetched successfully");
        setForecastData(data);
      } catch (err) {
        appLogger.log("error", err.message);
        setError(err.message);
      }
    };

    fetchForecastData();
  }, [forecastUrl, fetchService]);

  // Handler for updating location manually.
  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (!latInput || !lonInput) {
      setError("Both latitude and longitude are required.");
      return;
    }
    const newCoords = `${latInput},${lonInput}`;
    setCoordinates(newCoords);
    // Clear previous forecast data to trigger refetch.
    setForecastData(null);
    setForecastUrl(null);
    appLogger.log("info", `Manual location updated: ${newCoords}`);
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Occurred</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!forecastData) {
    return (
      <div className="loading-container">
        <h2>Loading Forecast Data...</h2>
      </div>
    );
  }

  const { periods } = forecastData.properties;
  const period = periods && periods.length > 0 ? periods[0] : null;

  return (
    <div className="app-container">
      <header className="header">
        <h1>BunForge Weather App</h1>
        <Icon
          iconSet="fa"
          iconName="FaSun"
          size={48}
          style={{ color: "#FFA500" }}
        />
      </header>
      <section className="location-form">
        <h2>Select Location</h2>
        <p>
          Detected Coordinates:{" "}
          {coordinates ? <strong>{coordinates}</strong> : "Detecting..."}
        </p>
        <form onSubmit={handleLocationSubmit}>
          <label>
            Latitude:
            <input
              type="number"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              step="any"
              required
            />
          </label>
          <label>
            Longitude:
            <input
              type="number"
              value={lonInput}
              onChange={(e) => setLonInput(e.target.value)}
              step="any"
              required
            />
          </label>
          <button type="submit">Update Location</button>
        </form>
      </section>
      <main className="main">
        <h2>Weather Forecast</h2>
        <p>
          Forecast URL: <a href={forecastUrl}>{forecastUrl}</a>
        </p>
        {period ? (
          <div className="forecast-box">
            <h3>{period.name}</h3>
            <p>
              <strong>Start:</strong>{" "}
              {formatDate(period.startTime, "en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Temperature:</strong> {period.temperature}°
              {period.temperatureUnit}
            </p>
            <p>
              <strong>Forecast:</strong> {period.detailedForecast}
            </p>
          </div>
        ) : (
          <p>No forecast period available.</p>
        )}
      </main>
      <footer className="footer">
        <p>
          Data provided by the National Weather Service API. This sample app
          demonstrates BunForge’s core services and utilities.
        </p>
      </footer>
    </div>
  );
};

export default App;
