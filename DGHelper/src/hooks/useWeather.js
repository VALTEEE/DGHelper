import { useState, useEffect, useRef } from "react";

export function useWeather(position) {
  const [weather, setWeather] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Fetch once — weather doesn't change meaningfully within a round
    if (!position || hasFetched.current) return;
    hasFetched.current = true;

    async function fetchWeather() {
      try {
        const { latitude, longitude } = position;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m,weathercode&timezone=auto`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data.current);
      } catch {
        // Weather is optional — silently fail
      }
    }

    fetchWeather();
  }, [position]);

  return weather;
}