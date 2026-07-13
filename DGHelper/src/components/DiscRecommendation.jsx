import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { rankDiscsForHole, getThrowRecommendation } from "../utils/flightModel";

export default function DiscRecommendation({ holeDistance, ownedDiscs, weather, holeBearing, obstacles }) {
  const { user } = useAuth();
  const throwDistance = user?.throw_distance || 0;
  const handedness = user?.throw_handedness || "right";

  if (!throwDistance) {
    return (
      <div className="disc-rec-empty">
        Set your throw distance in your <Link to="/profile">profile</Link> to get disc recommendations.
      </div>
    );
  }

  if (!ownedDiscs || ownedDiscs.length === 0) {
    return (
      <div className="disc-rec-empty">
        Add discs to your bag in <Link to="/your-bag">Your Bag</Link> to get recommendations.
      </div>
    );
  }

  const ranked = rankDiscsForHole(ownedDiscs, throwDistance, holeDistance, obstacles);
  const top3 = ranked.slice(0, 3);

  const sampleRec =
    top3.length > 0
      ? getThrowRecommendation(top3[0].flight, top3[0].disc, holeDistance, handedness, weather, holeBearing, obstacles)
      : null;

  return (
    <div className="disc-rec">
      <h3>Disc recommendation</h3>
      <p className="disc-rec-context">
        Hole: <strong>{holeDistance}m</strong> · Max throw: <strong>{throwDistance}m</strong> · {handedness === "left" ? "Left" : "Right"}-handed
      </p>

      {sampleRec?.obstacleNote && (       
         <div className="obstacle-banner">{sampleRec.obstacleNote}</div>
        )}

        {sampleRec?.windNote && (
         <div className="wind-banner">{sampleRec.windNote}</div>
        )}


      <div className="disc-rec-list">
        {top3.map(({ disc, flight, throws }, i) => {
          const throwRec = getThrowRecommendation(flight, disc, holeDistance, handedness, weather, holeBearing, obstacles);
          return (
            <div key={disc.id} className={`disc-rec-card rank-${i + 1}`}>
              <div className="disc-rec-rank">#{i + 1}</div>
              <div className="disc-rec-info">
                <div className="disc-rec-name">{disc.brand} {disc.name}</div>
                <div className="disc-rec-category">{disc.category}</div>
                <div className="disc-rec-stability">{flight.stabilityLabel}</div>
                <div className="disc-rec-stats">
                  <span>~{flight.effectiveDistance}m</span>
                  <span>{throwsLabel(throws, flight.effectiveDistance, holeDistance)}</span>
                  {(disc.wear || 0) < 0 && (
                    <span className="disc-rec-wear">
                      {"●".repeat(3 + (disc.wear || 0))}{"○".repeat(-(disc.wear || 0))} worn
                    </span>
                  )}
                </div>
                <div className="disc-throw-rec">
                  <span className={`throw-badge throw-badge-${throwRec.primary.release || "putt"}`}>
                    {throwRec.primary.label}
                  </span>
                  <p className="throw-rec-reason">{throwRec.primary.reason}</p>
                  {throwRec.secondary && (
                    <span className="throw-badge throw-badge-secondary">
                      Also: {throwRec.secondary.label}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {ranked.length === 0 && (
          <p>No discs in your bag yet. Add some in Your Bag.</p>
        )}
      </div>
    </div>
  );
}

function throwsLabel(throws, effectiveDistance, holeDistance) {
  const remaining = Math.max(0, holeDistance - effectiveDistance);

  if (throws === "one-throw") {
    if (remaining <= 0) return "Reaches basket";
    return `1 throw (~${remaining}m putt)`;
  }
  if (throws === "two-throw")   return `2 throws (~${remaining}m to go)`;
  if (throws === "multi-throw") return `3+ throws (~${remaining}m to go)`;
  return "";
}