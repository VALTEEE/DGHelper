import { useGPS } from "../hooks/useGPS";
import { useState, useEffect } from "react";



export default function Home() {

   // hooks here
  const { position, loading, error } = useGPS();
  const [weather, setWeather] = useState(null);

  //functions here
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

// useEffect here
  useEffect(() => {
  if (!position) return;  // just bail out early, nothing else

  async function fetchWeather() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${position.latitude}&longitude=${position.longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weathercode&timezone=auto`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    setWeather(data.current);  // store just the "current" part
  }

  fetchWeather();
}, [position]);

// 4. return LAST — only JSX inside here
  return (
    <div className="home-page">
      <div className="home-left">
        {/* Quick links + Mobile app ad */}
      </div>
      <div className="home-center">
        {/* Stats + Bag summary + Disc of day + Weather */}
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

