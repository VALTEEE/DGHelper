import { useState, useEffect } from "react";
import { allCourses } from "../data/courses/index.js";
import CourseMap from "../components/CourseMap";
import CourseInfo from "../components/CourseInfo";
import DiscRecommendation from "../components/DiscRecommendation";
import { fetchBag } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useGPS } from "../hooks/useGPS";
import { useWeather } from "../hooks/useWeather";
import { calculateDistance, calculateBearing } from "../utils/distance";

import tdgcImage from "../../public/images/tampere-dgc.png";

export default function CoursePage() {
  const { isAuthenticated } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [search, setSearch] = useState("");
  const [currentHole, setCurrentHole] = useState(1);
  const [gpsPermission, setGpsPermission] = useState("prompt");
  const [ownedDiscs, setOwnedDiscs] = useState([]);
  const [useGpsDistance, setUseGpsDistance] = useState(false);
  const { position: gpsPosition } = useGPS();
  const weather = useWeather(gpsPosition);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchBag()
      .then((data) => setOwnedDiscs(data.ownedDiscs || []))
      .catch(() => {});
  }, [isAuthenticated]);

  const filteredCourses = allCourses.filter((course) => {
    const q = search.toLowerCase();
    return (
      course.name.toLowerCase().includes(q) ||
      course.location.city.toLowerCase().includes(q) ||
      course.location.country.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setGpsPermission(result.state);
        result.addEventListener("change", () => setGpsPermission(result.state));
      });
    }
  }, []);

  function handleSelectCourse(course) {
    setSelectedCourse(course);
    setCurrentHole(1);
  }

  function handleBack() {
    setSelectedCourse(null);
  }

  // --- Detail view ---
  if (selectedCourse) {
    const currentHoleData = selectedCourse.holes.find((h) => h.number === currentHole);
    const holeDistance = currentHoleData?.distanceMeters || 0;
    const holeBearing =
  currentHoleData?.teePad && currentHoleData?.basket
    ? calculateBearing(currentHoleData.teePad, currentHoleData.basket)
    : null;

    const gpsDistanceToBasket =
      gpsPosition && currentHoleData?.basket
        ? Math.round(calculateDistance(gpsPosition, currentHoleData.basket))
       : null;

    const recommendationDistance =
      useGpsDistance && gpsDistanceToBasket !== null ? gpsDistanceToBasket : holeDistance;

    return (
      <div className="course-page">
        <button className="course-back-btn" onClick={handleBack}>
          ← Back to courses
        </button>

        {gpsPermission === "denied" && (
          <div
            className="permission-banner"
            style={{
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              width: "100%",
            }}
          >
            <strong>⚠️ GPS Access Denied</strong>
            <p>Enable location permissions in your browser settings to see your position on the map.</p>
          </div>
        )}

        <CourseInfo
          course={selectedCourse}
          currentHole={currentHole}
          onHoleChange={setCurrentHole}
        />

        <CourseMap course={selectedCourse} currentHole={currentHole} />

        <div className="rec-distance-toggle">
          <button
            className={`rec-toggle-btn ${!useGpsDistance ? "rec-toggle-active" : ""}`}
            onClick={() => setUseGpsDistance(false)}
         >
            Tee ({holeDistance}m)
         </button>
         <button
           className={`rec-toggle-btn ${useGpsDistance ? "rec-toggle-active" : ""}`}
            onClick={() => setUseGpsDistance(true)}
           disabled={gpsDistanceToBasket === null}
           title={gpsDistanceToBasket === null ? "GPS not available" : ""}
         >
           📍 GPS {gpsDistanceToBasket !== null ? `(${gpsDistanceToBasket}m)` : "(no signal)"}
         </button>
        </div>
              
        <DiscRecommendation
           holeDistance={recommendationDistance}
           ownedDiscs={ownedDiscs}
           weather={weather}
           holeBearing={holeBearing}
/>     
      </div>
    );
  }

  // --- List view ---
  return (
    <div className="courses-list-page">
      <div className="courses-search-wrapper">
        <input
          className="courses-search-input"
          type="text"
          placeholder="Search courses by name or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <p className="courses-empty">No courses found for "{search}".</p>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <button
              key={course.id}
              className="course-card"
              onClick={() => handleSelectCourse(course)}
            >
              <div className="course-card-image-wrapper">
                <img
                  src={tdgcImage}
                  alt={`${course.name} preview`}
                  className="course-card-image"
                />
              </div>
              <div className="course-card-info">
                <h3 className="course-card-name">{course.name}</h3>
                <p className="course-card-meta">
                  {course.location.city}, {course.location.country}
                </p>
                <p className="course-card-holes">{course.totalHoles} & 27 holes</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}