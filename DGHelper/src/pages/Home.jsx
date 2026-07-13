import { useGPS } from "../hooks/useGPS";
import { useWeather } from "../hooks/useWeather";

export default function Home() {
  const { position, loading } = useGPS();
  const weather = useWeather(position);

  function getWeatherDescription(code) {
    if (code === 0) return "☀️ Clear sky";
    if (code <= 3) return "⛅ Partly cloudy";
    if (code <= 48 && code >= 45) return "🌫️ Foggy";
    if (code <= 55 && code >= 51) return "🌧️ Drizzle";
    if (code <= 65 && code >= 61) return "🌧️ Rain";
    if (code <= 75 && code >= 71) return "❄️ Snow";
    if (code >= 80 && code <= 82) return "🌨️ Rain showers";
    if (code === 95) return "⛈️ Thunderstorm";
    return "🌡️ Unknown";
  }

  return (
    <div className="home-page">
      <div className="home-left">
        {/* Quick links + Mobile app ad */}
      </div>
      <div className="home-center">
        {loading && <p>Getting your location...</p>}
        {!loading && !weather && <p>Fetching weather...</p>}
        {weather && (
          <div className="weather-card">
            <h3>Current Weather</h3>
            <p>Temperature: {weather.temperature_2m}°C</p>
            <p>Wind Speed: {weather.wind_speed_10m} m/s</p>
            <p>Wind Direction: {weather.wind_direction_10m}°</p>
            <p>Weather Code: {weather.weathercode}</p>
            <p>Description: {getWeatherDescription(weather.weathercode)}</p>
          </div>
        )}
      </div>
      <div className="home-right">
        {/* Near You courses */}
      </div>
    </div>
  );
}