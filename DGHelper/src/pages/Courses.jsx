import { tampereDGC } from "../data/courses/tampere-dgc.js";
import CourseMap from "../components/CourseMap";
import CourseInfo from "../components/CourseInfo";
import { useState } from "react";

export default function CoursePage() {
  const course = tampereDGC;
  const [currentHole, setCurrentHole] = useState(1);
  const [gpsPermission, setGpsPermission] = useState("prompt"); // prompt, granted, denied

  // Request GPS permission on mount
  useState(() => {
    if ("permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" })
        .then((result) => {
          setGpsPermission(result.state);
          result.addEventListener("change", () => {
            setGpsPermission(result.state);
          });
        });
    }
  }, []);

  return (
    <div className="course-page">
      {/* GPS Permission Notice */}
      {gpsPermission === "denied" && (
        <div className="permission-banner" style={{
          background: "#fef3c7",
          border: "1px solid #f59e0b",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "16px"
        }}>
          <strong>⚠️ GPS Access Denied</strong>
          <p>To see your location on the map, please enable location permissions in your browser settings.</p>
        </div>
      )}

      <CourseInfo 
        course={course} 
        currentHole={currentHole} 
        onHoleChange={setCurrentHole} 
      />
      <CourseMap course={course} currentHole={currentHole} />
    </div>
  );
}