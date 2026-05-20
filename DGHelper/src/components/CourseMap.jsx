import React, { useState, useRef } from "react";
import { useGPS } from "../hooks/useGPS";
import { calculateDistance } from "../utils/distance";

export default function CourseMap({ course, currentHole }) {
  const { position: gpsPosition, error: gpsError, loading: gpsLoading } = useGPS();
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef(null);

  if (!course || !course.holes) return <div>No course data</div>;

  const hole = course.holes.find(h => h.number === currentHole) || course.holes[0];
  
  // Get image info (with fallbacks)
  const imageUrl = hole.mapImage || `/images/courses/${course.id}/hole-${hole.number}-map.jpg`;
  const imageDims = hole.imageDimensions || { width: 1200, height: 800 };

  // ✅ CORRECTED: GPS → Pixel using your manual calibration
  const gpsToPixel = (gpsCoord) => {
    if (!gpsCoord || !hole.teePad || !hole.basket || !hole.imageCalibration) {
      return null;
    }

    // Normalize coordinate names (handle both {lat, lng} and {latitude, longitude})
    const userLat = gpsCoord.latitude ?? gpsCoord.lat;
    const userLng = gpsCoord.longitude ?? gpsCoord.lng;
    
    const teeLat = hole.teePad.lat;
    const teeLng = hole.teePad.lng;
    const basketLat = hole.basket.lat;
    const basketLng = hole.basket.lng;
    
    const { teePixel, basketPixel } = hole.imageCalibration;

    // Calculate deltas
    const lngDelta = basketLng - teeLng;
    const latDelta = basketLat - teeLat;

    // Calculate ratios (how far user is between tee and basket)
    // Use 0.5 fallback if delta is ~0 (prevents division by zero)
    const lngRatio = Math.abs(lngDelta) > 0.000001 
      ? (userLng - teeLng) / lngDelta 
      : 0.5;
      
    const latRatio = Math.abs(latDelta) > 0.000001 
      ? (userLat - teeLat) / latDelta 
      : 0.5;

    // Linear interpolation to pixel space
    const x = teePixel.x + lngRatio * (basketPixel.x - teePixel.x);
    const y = teePixel.y + latRatio * (basketPixel.y - teePixel.y);

    return { x, y };
  };

  // Get user pixel position
  const userPixel = gpsPosition ? gpsToPixel(gpsPosition) : null;
  
  // Calculate distances
  const distanceToBasket = gpsPosition && hole.basket 
    ? calculateDistance(gpsPosition, hole.basket)
    : null;

  // ✅ Helper to position markers (tee, basket, obstacles) using same calibration
  const getMarkerPixel = (markerGPS) => {
    if (!markerGPS || !hole.teePad || !hole.basket || !hole.imageCalibration) {
      return { x: imageDims.width * 0.5, y: imageDims.height * 0.5 }; // fallback center
    }
    return gpsToPixel(markerGPS) || { x: imageDims.width * 0.5, y: imageDims.height * 0.5 };
  };

  return (
    <div className="course-map-container">
      <div className="map-header">
        <h3>Hole {hole.number} Map</h3>
        <div className="gps-status">
          {gpsLoading && <span className="status-loading">📡 Getting GPS...</span>}
          {gpsError && <span className="status-error">⚠️ {gpsError}</span>}
          {gpsPosition && (
            <span className="status-ok">
              📍 ±{Math.round(gpsPosition.accuracy)}m
            </span>
          )}
        </div>
      </div>

      {/* Distance Info */}
      {distanceToBasket !== null && (
        <div className="distance-info">
          <div className="distance-item">
            <strong>To Basket:</strong> {Math.round(distanceToBasket)}m
          </div>
        </div>
      )}

      {/* Map Image Container */}
      <div 
        ref={containerRef}
        className="map-image-wrapper"
        style={{ position: "relative", display: "inline-block" }}
      >
        {/* The Hole Map Image */}
        <img
          src={imageUrl}
          alt={`Hole ${hole.number} map`}
          className="hole-map-image"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            borderRadius: "8px",
            border: "2px solid #e5e7eb"
          }}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Loading State */}
        {!imageLoaded && (
          <div className="map-loading" style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255,255,255,0.9)",
            padding: "16px",
            borderRadius: "8px"
          }}>
            Loading map...
          </div>
        )}

        {/* Tee Marker */}
        {hole.teePad && imageLoaded && (() => {
          const pos = getMarkerPixel(hole.teePad);
          return (
            <MapMarker
              label="Tee"
              emoji="🟢"
              pixelPos={pos}
              imageDims={imageDims}
              type="tee"
            />
          );
        })()}

        {/* Basket Marker */}
        {hole.basket && imageLoaded && (() => {
          const pos = getMarkerPixel(hole.basket);
          return (
            <MapMarker
              label="Basket"
              emoji="🎯"
              pixelPos={pos}
              imageDims={imageDims}
              type="basket"
            />
          );
        })()}

        {/* User GPS Position */}
        {userPixel && imageLoaded && (
          <div
            className="user-gps-marker"
            style={{
              position: "absolute",
              left: `${(userPixel.x / imageDims.width) * 100}%`,
              top: `${(userPixel.y / imageDims.height) * 100}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              pointerEvents: "none",
              transition: "left 0.8s ease-out, top 0.8s ease-out" // Smooth GPS updates
            }}
          >
            {/* Accuracy Circle */}
            <div
              style={{
                position: "absolute",
                width: `${(gpsPosition.accuracy / Math.max(imageDims.width, imageDims.height)) * 200}%`,
                height: `${(gpsPosition.accuracy / Math.max(imageDims.width, imageDims.height)) * 200}%`,
                borderRadius: "50%",
                background: "rgba(59, 130, 246, 0.2)",
                border: "2px dashed #3b82f6",
                transform: "translate(-50%, -50%)",
                animation: "pulse 2s ease-out infinite"
              }}
            />
            
            {/* User Dot */}
            <div
              style={{
                width: "20px",
                height: "20px",
                background: "#3b82f6",
                border: "3px solid white",
                borderRadius: "50%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                position: "relative",
                zIndex: 11
              }}
            />
            
            {/* Label */}
            <div
              style={{
                position: "absolute",
                top: "-25px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "2px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
                fontWeight: "bold"
              }}
            >
              You
            </div>
          </div>
        )}

        {/* Obstacle Markers */}
        {hole.obstacles?.map((obs, i) => {
          if (!obs.points?.[0] || !imageLoaded) return null;
          const pos = getMarkerPixel(obs.points[0]);
          return (
            <MapMarker
              key={`${hole.number}-obs-${i}`}
              label={obs.note || obs.type}
              emoji={obs.type === "trees" ? "🌲" : obs.type === "water" ? "💧" : "⚠️"}
              pixelPos={pos}
              imageDims={imageDims}
              type="obstacle"
              severity={obs.severity}
            />
          );
        })}
      </div>
    </div>
  );
}

// ✅ Updated Reusable Marker Component (uses pixelPos directly)
function MapMarker({ label, emoji, pixelPos, imageDims, type, severity }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${(pixelPos.x / imageDims.width) * 100}%`,
        top: `${(pixelPos.y / imageDims.height) * 100}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 5,
        cursor: "pointer"
      }}
      title={label}
    >
      <div
        style={{
          fontSize: type === "obstacle" ? "20px" : "24px",
          filter: severity === "heavy" ? "drop-shadow(0 0 4px red)" : "none"
        }}
      >
        {emoji}
      </div>
    </div>
  );
}