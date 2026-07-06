import { useState } from "react";

const TYPE_FILTERS = ["All", "Putters", "Midranges", "Fairway", "Distance"];

function getDiscType(speed) {
  if (speed <= 4) return "Putters";
  if (speed <= 7) return "Midranges";
  if (speed <= 10) return "Fairway";
  return "Distance";
}

const TYPE_COLORS = {
  Putters: "#7c3aed",
  Midranges: "#059669",
  Fairway: "#2563eb",
  Distance: "#dc2626",
};

function createDiscLink(name) {
  if (name === "<- Tilt") {
    return "https://trydiscs-prod.s3.amazonaws.com/disc_images/tilt.webp";
  }
  const nameFormatted = name
    .replace(/[-<>]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return `https://trydiscs-prod.s3.amazonaws.com/disc_images/${nameFormatted}.webp`;
}

export default function DiscSearch({
  searchTerm,
  setSearchTerm,
  searchResults,
  onAddDisc,
  ownedDiscs = [],
  selectedBag,
}) {
  const [typeFilter, setTypeFilter] = useState("All");

  const filteredResults =
    typeFilter === "All"
      ? searchResults
      : searchResults.filter((d) => getDiscType(d.speed) === typeFilter);

  return (
    <div className="disc-search-panel">
      <div className="disc-search-header">
        <h2>Find Discs</h2>
        {selectedBag && (
          <span className="search-bag-context">
            Adding to: <strong>{selectedBag.name}</strong>
          </span>
        )}
      </div>

      {/* Search input */}
      <div className="disc-search-input-wrapper">
        <span className="disc-search-icon">🔍</span>
        <input
          type="text" style={{ color: "#000" }}
          placeholder="Search by disc name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="disc-search-input-new"
        />
        {searchTerm && (
          <button
            className="disc-search-clear"
            onClick={() => setSearchTerm("")}
          >
            ×
          </button>
        )}
      </div>

      {/* Type filter pills — only shown when results exist */}
      {searchResults.length > 0 && (
        <div className="disc-type-pills">
          {TYPE_FILTERS.map((type) => {
            const count =
              type === "All"
                ? searchResults.length
                : searchResults.filter((d) => getDiscType(d.speed) === type).length;
            if (count === 0 && type !== "All") return null;
            return (
              <button
                key={type}
                className={`disc-type-pill ${typeFilter === type ? "disc-type-pill-active" : ""}`}
                onClick={() => setTypeFilter(type)}
                style={
                  typeFilter === type && type !== "All"
                    ? {
                        backgroundColor: TYPE_COLORS[type],
                        borderColor: TYPE_COLORS[type],
                        color: "#fff",
                      }
                    : {}
                }
              >
                {type}
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Search results */}
      {filteredResults.length > 0 && (
        <div className="disc-search-results">
          {filteredResults.map((disc) => {
            const inCollection = ownedDiscs.some((d) => d.id === disc.id);
            const inBag = selectedBag?.discIds.includes(disc.id);
            const discType = getDiscType(disc.speed);

            return (
              <div
                key={disc.id}
                className={`disc-result-card ${inBag ? "disc-result-in-bag" : ""}`}
              >
                <img
                  src={createDiscLink(disc.name)}
                  alt={disc.name}
                  className="disc-result-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/no-disc-image.png";
                  }}
                />

                <div className="disc-result-info">
                  <span className="disc-result-name">
                    {disc.brand} {disc.name}
                  </span>
                  <div className="disc-result-meta">
                    <span
                      className="disc-result-type"
                      style={{ backgroundColor: TYPE_COLORS[discType] }}
                    >
                      {discType}
                    </span>
                    <span className="disc-result-flight">
                      {disc.speed} / {disc.glide} / {disc.turn} / {disc.fade}
                    </span>
                  </div>
                </div>

                <div className="disc-result-action">
                  {inBag ? (
                    <span className="disc-status-badge disc-in-bag">In Bag ✓</span>
                  ) : inCollection && !selectedBag ? (
                    <span className="disc-status-badge disc-in-collection">
                      In Collection ✓
                    </span>
                  ) : (
                    <button
                      className="disc-add-btn"
                      onClick={() => onAddDisc(disc)}
                    >
                      {selectedBag ? `+ Add to Bag` : `+ Add`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {searchTerm.trim() && filteredResults.length === 0 && searchResults.length > 0 && (
        <p className="disc-search-empty">
          No {typeFilter.toLowerCase()} matching your search.
        </p>
      )}

      {searchTerm.trim() && searchResults.length === 0 && (
        <p className="disc-search-empty">No discs found for &ldquo;{searchTerm}&rdquo;</p>
      )}
    </div>
  );
}
