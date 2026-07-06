import { useAuth } from "../context/AuthContext";
import { rankDiscsForHole } from "../utils/flightModel";

export default function DiscRecommendation({ holeDistance, ownedDiscs }) {
  const { user } = useAuth();
  const throwDistance = user?.throw_distance || 0;

  if (!throwDistance) {
    return (
      <div className="disc-rec-empty">
        Set your throw distance in your <a href="/profile">profile</a> to get disc recommendations.
      </div>
    );
  }

  if (!ownedDiscs || ownedDiscs.length === 0) {
    return (
      <div className="disc-rec-empty">
        Add discs to your bag in <a href="/your-bag">Your Bag</a> to get recommendations.
      </div>
    );
  }

  const ranked = rankDiscsForHole(ownedDiscs, throwDistance, holeDistance);
  const top3 = ranked.slice(0, 3);

  return (
    <div className="disc-rec">
      <h3>Disc recommendation</h3>
      <p className="disc-rec-context">
        Hole: <strong>{holeDistance}m</strong> · Your max throw: <strong>{throwDistance}m</strong>
      </p>

      <div className="disc-rec-list">
        {top3.map(({ disc, flight, throws }, i) => (
          <div key={disc.id} className={`disc-rec-card rank-${i + 1}`}>
            <div className="disc-rec-rank">#{i + 1}</div>
            <div className="disc-rec-info">
              <div className="disc-rec-name">{disc.brand} {disc.name}</div>
              <div className="disc-rec-category">{disc.category}</div>
              <div className="disc-rec-stability">{flight.stabilityLabel}</div>
              <div className="disc-rec-flight">{flight.flightDescription}</div>
              <div className="disc-rec-stats">
                <span>Reaches ~{flight.effectiveDistance}m</span>
                <span>{throwsLabel(throws)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {ranked.length === 0 && (
        <p>No discs in your bag yet. Add some in Your Bag.</p>
      )}
    </div>
  );
}

function throwsLabel(throws) {
  if (throws === "one-throw")   return "Reaches in 1 throw";
  if (throws === "two-throw")   return "Needs 2 throws";
  if (throws === "multi-throw") return "Multiple throws needed";
  return "";
}