import { useState } from "react";

function getDiscType(speed) {
  if (speed <= 4) return "Putter";
  if (speed <= 7) return "Midrange";
  if (speed <= 10) return "Fairway";
  return "Driver";
}

const TYPE_ORDER = ["Putter", "Midrange", "Fairway", "Driver"];

const TYPE_LABELS = {
  Putter: "Putters",
  Midrange: "Midranges",
  Fairway: "Fairway Drivers",
  Driver: "Distance Drivers",
};

const TYPE_COLORS = {
  Putter: "#a78bfa",
  Midrange: "#34d399",
  Fairway: "#60a5fa",
  Driver: "#f87171",
};

export default function BagManager({
  newBagName,
  setNewBagName,
  createBag,
  deleteBag,
  bags,
  selectedBagId,
  setSelectedBagId,
  selectedBag,
  selectedBagDiscs,
  removeDiscFromBag,
}) {
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function handleCreateBag() {
    if (!newBagName.trim()) return;
    createBag();
    setShowCreateInput(false);
  }

  // Group discs by type for organised bag view
  const discsByType = TYPE_ORDER.reduce((acc, type) => {
    acc[type] = selectedBagDiscs.filter((d) => getDiscType(d.speed) === type);
    return acc;
  }, {});

  return (
    <div className="bag-panel">
      {/* Tab bar */}
      <div className="bag-tabs-bar">
        <div className="bag-tabs-scroll">
          {bags.map((bag) => (
            <div
              key={bag.id}
              className={`bag-tab-wrapper ${selectedBagId === bag.id ? "bag-tab-active-wrapper" : ""}`}
            >
              <button
                className={`bag-tab ${selectedBagId === bag.id ? "bag-tab-active" : ""}`}
                onClick={() => setSelectedBagId(bag.id)}
              >
                {bag.name}
                <span className="bag-tab-count">{bag.discIds.length}</span>
              </button>

              {confirmDelete === bag.id ? (
                <span className="bag-tab-confirm-row">
                  <button
                    className="bag-tab-confirm-yes"
                    onClick={() => { deleteBag(bag.id); setConfirmDelete(null); }}
                    title="Confirm delete"
                  >✓</button>
                  <button
                    className="bag-tab-confirm-no"
                    onClick={() => setConfirmDelete(null)}
                    title="Cancel"
                  >×</button>
                </span>
              ) : (
                <button
                  className="bag-tab-delete"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(bag.id); }}
                  title="Delete bag"
                >🗑</button>
              )}
            </div>
          ))}
        </div>

        <button
          className={`bag-tab-new ${showCreateInput ? "bag-tab-new-open" : ""}`}
          onClick={() => setShowCreateInput((v) => !v)}
        >
          {showCreateInput ? "×" : "+ New"}
        </button>
      </div>

      {/* Inline create-bag form */}
      {showCreateInput && (
        <div className="bag-create-inline">
          <input
            type="text"
            placeholder="Name your bag..."
            value={newBagName}
            onChange={(e) => setNewBagName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateBag()}
            autoFocus
            className="bag-create-input"
          />
          <button className="bag-create-btn" onClick={handleCreateBag}>
            Create
          </button>
        </div>
      )}

      {/* Empty state: no bags yet */}
      {bags.length === 0 && (
        <div className="bag-empty-state">
          <div className="bag-empty-icon">🎒</div>
          <h3>No bags yet</h3>
          <p>Create your first bag to start organising your discs!</p>
          <button
            className="bag-empty-create-btn"
            onClick={() => setShowCreateInput(true)}
          >
            + Create a Bag
          </button>
        </div>
      )}

      {/* The visual bag body */}
      {bags.length > 0 && selectedBag && (
        <div className="bag-visual">
          {/* Physical strap/handle at top */}
          <div className="bag-strap" />

          {/* Bag header */}
          <div className="bag-visual-header">
            <div className="bag-header-left">
              <span className="bag-emoji">🎒</span>
              <h2 className="bag-visual-name">{selectedBag.name}</h2>
            </div>
            <span className="bag-disc-count-badge">
              {selectedBagDiscs.length}{" "}
              {selectedBagDiscs.length === 1 ? "disc" : "discs"}
            </span>
          </div>

          {/* Disc slots */}
          <div className="bag-body">
            {selectedBagDiscs.length === 0 ? (
              <div className="bag-body-empty">
                <p>This bag is empty.</p>
                <p className="bag-body-hint">
                  Search for discs on the left — they&apos;ll be added directly to this bag.
                </p>
              </div>
            ) : (
              TYPE_ORDER.map((type) => {
                const discs = discsByType[type];
                if (discs.length === 0) return null;
                return (
                  <div key={type} className="bag-type-group">
                    <div className="bag-type-header">
                      <span
                        className="bag-type-dot"
                        style={{ backgroundColor: TYPE_COLORS[type] }}
                      />
                      <span className="bag-type-label">{TYPE_LABELS[type]}</span>
                      <span className="bag-type-count">{discs.length}</span>
                    </div>

                    {discs.map((disc) => (
                      <div key={disc.id} className="bag-disc-row">
                        <div className="bag-disc-row-info">
                          <span className="bag-disc-row-name">
                            {disc.brand} {disc.name}
                          </span>
                          <span className="bag-disc-row-numbers">
                            {disc.speed} / {disc.glide} / {disc.turn} / {disc.fade}
                          </span>
                        </div>
                        <button
                          className="bag-disc-row-remove"
                          onClick={() => removeDiscFromBag(disc.id)}
                          title="Remove from bag"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {bags.length > 0 && !selectedBag && (
        <div className="bag-empty-state">
          <p>Select a bag from the tabs above.</p>
        </div>
      )}
    </div>
  );
}
