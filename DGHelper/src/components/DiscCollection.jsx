import { useState } from "react";

function getDiscType(speed) {
  if (speed <= 4) return "Putter";
  if (speed <= 7) return "Midrange";
  if (speed <= 10) return "Fairway";
  return "Driver";
}

const TYPE_COLORS = {
  Putter: "#7c3aed",
  Midrange: "#059669",
  Fairway: "#2563eb",
  Driver: "#dc2626",
};

const TYPE_FILTERS = ["All", "Putter", "Midrange", "Fairway", "Driver"];

export default function DiscCollection({
  ownedDiscs,
  selectedBag,
  addDiscToBag,
  removeFromCollection,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");

  const filtered =
    typeFilter === "All"
      ? ownedDiscs
      : ownedDiscs.filter((d) => getDiscType(d.speed) === typeFilter);

  return (
    <div className="collection-panel">
      {/* Collapsible header */}
      <div
        className="collection-header"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="collection-header-left">
          <h2>My Collection</h2>
          <span className="collection-count-badge">{ownedDiscs.length}</span>
        </div>
        <span className="collection-toggle-icon">{collapsed ? "▼" : "▲"}</span>
      </div>

      {!collapsed && (
        <>
          {/* Type filter — only shown when there are enough discs */}
          {ownedDiscs.length > 3 && (
            <div className="collection-type-filters">
              {TYPE_FILTERS.map((t) => {
                const count =
                  t === "All"
                    ? ownedDiscs.length
                    : ownedDiscs.filter((d) => getDiscType(d.speed) === t).length;
                if (count === 0 && t !== "All") return null;
                return (
                  <button
                    key={t}
                    className={`disc-type-pill ${typeFilter === t ? "disc-type-pill-active" : ""}`}
                    onClick={() => setTypeFilter(t)}
                    style={
                      typeFilter === t && t !== "All"
                        ? {
                            backgroundColor: TYPE_COLORS[t],
                            borderColor: TYPE_COLORS[t],
                            color: "#fff",
                          }
                        : {}
                    }
                  >
                    {t}s
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="collection-empty-msg">
              {ownedDiscs.length === 0
                ? "Search for discs above to add them to your collection."
                : `No ${typeFilter.toLowerCase()}s in your collection.`}
            </p>
          ) : (
            <div className="collection-list">
              {filtered.map((disc) => {
                const type = getDiscType(disc.speed);
                const inBag = selectedBag?.discIds.includes(disc.id);

                return (
                  <div key={disc.id} className="collection-disc-row">
                    <span
                      className="collection-type-indicator"
                      style={{ backgroundColor: TYPE_COLORS[type] }}
                      title={type}
                    />
                    <div className="collection-disc-details">
                      <span className="collection-disc-name">
                        {disc.brand} {disc.name}
                      </span>
                      <span className="collection-disc-numbers">
                        {disc.speed} / {disc.glide} / {disc.turn} / {disc.fade}
                      </span>
                    </div>
                    <div className="collection-disc-btns">
                      {selectedBag &&
                        (inBag ? (
                          <span className="collection-in-bag-tag">In Bag</span>
                        ) : (
                          <button
                            className="collection-add-bag-btn"
                            onClick={() => addDiscToBag(disc.id)}
                          >
                            + Bag
                          </button>
                        ))}
                      <button
                        className="collection-remove-btn"
                        onClick={() => removeFromCollection(disc.id)}
                        title="Remove from collection"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
