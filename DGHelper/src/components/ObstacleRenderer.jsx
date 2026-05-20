// src/components/ObstacleRenderer.jsx
import React from "react";

export default function ObstacleRenderer({ obstacle, bounds, svgSize }) {
  if (!obstacle || !bounds || !svgSize) return null;

  const toSvg = (pt) => ({
    x: ((pt.lng - bounds.west) / (bounds.east - bounds.west)) * svgSize.width,
    y: ((bounds.north - pt.lat) / (bounds.north - bounds.south)) * svgSize.height,
  });

  // POINT: Single tree, marker
  if (obstacle.shape === "point" && obstacle.points?.length > 0) {
    const p = toSvg(obstacle.points[0]);
    return (
      <g title={obstacle.note}>
        <circle cx={p.x} cy={p.y} r="4" fill="#5D4037" opacity="0.8" />
        <text x={p.x + 6} y={p.y + 4} fontSize="10" fill="#333">
          {obstacle.type === "trees" ? "🌲" : "⚠️"}
        </text>
      </g>
    );
  }

  // LINE: Treeline, fence
  if (obstacle.shape === "line" && obstacle.points?.length === 2) {
    const p1 = toSvg(obstacle.points[0]);
    const p2 = toSvg(obstacle.points[1]);
    return (
      <line
        x1={p1.x} y1={p1.y}
        x2={p2.x} y2={p2.y}
        stroke={obstacle.type === "trees" ? "#2E7D32" : "#1565C0"}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
        title={obstacle.note}
      />
    );
  }

  // POLYGON: Pond, OB zone
  if (obstacle.shape === "polygon" && obstacle.points?.length >= 3) {
    const pts = obstacle.points.map((p) => {
      const { x, y } = toSvg(p);
      return `${x},${y}`;
    }).join(" ");
    return (
      <polygon
        points={pts}
        fill={obstacle.type === "water" ? "rgba(33, 150, 243, 0.25)" : "rgba(244, 67, 54, 0.2)"}
        stroke={obstacle.type === "water" ? "#1565C0" : "#C62828"}
        strokeWidth="1.5"
        title={obstacle.note}
      />
    );
  }

  // ZONE: Text note only
  if (obstacle.shape === "zone") {
    return null; // Rendered in CourseInfo instead
  }

  return null;
}