import React from "react";

/**
 * Displays course metadata, hole selector, and selected hole details.
 * @param {Object} course - Full course object from API
 * @param {number} currentHole - Currently selected hole number
 * @param {function} onHoleChange - Callback when user selects a different hole
 */
export default function CourseInfo({ course, currentHole, onHoleChange }) {
  if (!course || !course.holes) return null;

  const hole = course.holes.find(h => h.number === currentHole) || course.holes[0];

  return (
    <div className="course-info">
      <header className="course-header">
        <h1>{course.name}</h1>
        <p>{course.city}, {course.country} • {course.totalHoles} holes</p>
      </header>

      {/* Hole Selector */}
      <div className="hole-selector">
        <label htmlFor="hole-select">Hole:</label>
        <select
          id="hole-select"
          value={currentHole}
          onChange={(e) => onHoleChange(Number(e.target.value))}
          className="hole-dropdown"
        >
          {course.holes.map((h) => (
            <option key={h.number} value={h.number}>
              {h.number}
            </option>
          ))}
        </select>
      </div>

      {/* Hole Details */}
      <div className="hole-details">
        <h2>Hole {hole.number}</h2>
        
        <div className="stats-row">
          <div className="stat"><strong>Par:</strong> {hole.par}</div>
          <div className="stat"><strong>Distance:</strong> {hole.distanceMeters}m</div>
        </div>

        {/* Throw Recommendation */}
        {hole.idealThrow && hole.idealThrow.shape !== "unknown" && (
          <div className="throw-rec">
            <h3>🎯 Recommended Throw</h3>
            <p><strong>Shape:</strong> {hole.idealThrow.shape}</p>
            <p><strong>Why:</strong> {hole.idealThrow.reason || "No reason provided"}</p>
          </div>
        )}

        {/* Obstacles Summary */}
        {hole.obstacles?.length > 0 && (
          <div className="obstacles-summary">
            <h3>⚠️ Hazards ({hole.obstacles.length})</h3>
            <ul>
              {hole.obstacles.map((obs, i) => (
                <li key={i} className={`obstacle-${obs.severity}`}>
                  {obs.note || `${obs.type} (${obs.shape})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}