import { useState, useEffect } from "react";

/**
 * Custom hook to track user's GPS position
 * @returns {Object} position, error, loading
 */
export function useGPS() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    // Success callback - called when GPS updates
    const handleSuccess = (pos) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy, // in meters
        timestamp: pos.timestamp,
      });
      setLoading(false);
      setError(null);
    };

    // Error callback
    const handleError = (err) => {
      setError(getErrorMessage(err.code));
      setLoading(false);
    };

    // Start watching position (updates as user moves)
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true, // Use GPS (more battery, more accurate)
        timeout: 10000,            // Max 10 seconds to get position
        maximumAge: 5000,          // Accept positions up to 5 seconds old
      }
    );

    // Cleanup: stop watching when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { position, error, loading };
}

// Helper to convert error codes to messages
function getErrorMessage(code) {
  switch (code) {
    case 1:
      return "Location access denied. Please enable permissions.";
    case 2:
      return "Location unavailable. Check your device settings.";
    case 3:
      return "Location request timed out. Try again.";
    default:
      return "Unknown location error";
  }
}