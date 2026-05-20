import React from "react";
import ObstacleRenderer from "./ObstacleRenderer";
import { useGPS } from "../hooks/useGPS";
import { calculateDistance } from "../utils/distance";

export default function CourseMap({ course, currentHole }) {
  // Get GPS position
  const { position: gpsPosition, error: gpsError, loading: gpsLoading } = useGPS();

  if (!course || !course.holes) return <div>No course data</div>;

  const hole = course.holes.find(h => h.number === currentHole) || course.holes[0];
  const svgSize = { width: 800, height: 600 };
  const bounds = course.bounds;

  // Convert GPS → SVG pixels
  const toSvg = (pt) => ({
    x: ((pt.lng - bounds.west) / (bounds.east - bounds.west)) * svgSize.width,
    y: ((bounds.north - pt.lat) / (bounds.north - bounds.south)) * svgSize.height,
  });

  // Calculate distances if we have GPS
  let distanceToTee = null;
  let distanceToBasket = null;
  let userSvgPosition = null;

  if (gpsPosition) {
    const userGPS = {
      latitude: gpsPosition.latitude,
      longitude: gpsPosition.longitude,
    };

    // Distance to tee
    if (hole.teePad) {
      distanceToTee = calculateDistance(userGPS, hole.teePad);
    }

    // Distance to basket
    if (hole.basket) {
      distanceToBasket = calculateDistance(userGPS, hole.basket);
    }

    // Convert user GPS to SVG position
    userSvgPosition = toSvg({
      lat: gpsPosition.latitude,
      lng: gpsPosition.longitude,
    });
  }

  return (
    <div className="course-map-container">
      <div className="map-header">
        <h3>Hole {hole.number} Map</h3>
        
        {/* GPS Status */}
        <div className="gps-status">
          {gpsLoading && <span className="status-loading">📡 Getting GPS...</span>}
          {gpsError && <span className="status-error">⚠️ {gpsError}</span>}
          {gpsPosition && (
            <span className="status-ok">
              📍 Accuracy: ±{Math.round(gpsPosition.accuracy)}m
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
          {distanceToTee !== null && (
            <div className="distance-item">
              <strong>To Tee:</strong> {Math.round(distanceToTee)}m
            </div>
          )}
        </div>
      )}

      {/* SVG Map */}
      <svg 
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`} 
        className="course-svg"
        style={{ border: "1px solid #ddd", borderRadius: "8px", background: "#f9fafb" }}
      >
        {/* Fairway Path */}
        <polyline
          points={hole.fairwayPath
            .map((p) => {
              const { x, y } = toSvg(p);
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#4CAF50"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Tee Pad */}
        {hole.teePad && (
          <g>
            <circle
              cx={toSvg(hole.teePad).x}
              cy={toSvg(hole.teePad).y}
              r="8"
              fill="#2E7D32"
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={toSvg(hole.teePad).x}
              y={toSvg(hole.teePad).y - 12}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
            >
              Tee
            </text>
          </g>
        )}

        {/* Basket */}
        {hole.basket && (
          <g>
            <circle
              cx={toSvg(hole.basket).x}
              cy={toSvg(hole.basket).y}
              r="6"
              fill="#D32F2F"
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              x={toSvg(hole.basket).x}
              y={toSvg(hole.basket).y - 12}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
            >
              🎯
            </text>
          </g>
        )}

        {/* 👤 USER POSITION (GPS Dot) */}
        {userSvgPosition && (
          <g className="user-position">
            {/* Accuracy circle (shows GPS uncertainty) */}
            <circle
              cx={userSvgPosition.x}
              cy={userSvgPosition.y}
              r={gpsPosition.accuracy / 2} // Scale accuracy to SVG
              fill="rgba(59, 130, 246, 0.2)"
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            
            {/* User dot */}
            <circle
              cx={userSvgPosition.x}
              cy={userSvgPosition.y}
              r="8"
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth="2"
            />
            
            {/* Pulse animation ring */}
            <circle
              cx={userSvgPosition.x}
              cy={userSvgPosition.y}
              r="8"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              className="pulse-ring"
            />
            
            <text
              x={userSvgPosition.x}
              y={userSvgPosition.y - 12}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
              fontWeight="bold"
            >
              You
            </text>
          </g>
        )}

        {/* Obstacles */}
        {hole.obstacles?.map((obs, i) => (
          <ObstacleRenderer
            key={`${hole.number}-obs-${i}`}
            obstacle={obs}
            bounds={bounds}
            svgSize={svgSize}
          />
        ))}
      </svg>
    </div>
  );
}