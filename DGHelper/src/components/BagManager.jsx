export default function BagManager({
  newBagName,
  setNewBagName,
  createBag,
  bags,
  selectedBagId,
  setSelectedBagId,
  selectedBag,
  selectedBagDiscs,
  removeDiscFromBag
}) {
  return (
    <>
      {/* Create bag */}
      <div className="bag-create-section">
        <h2>Create New Bag</h2>
        <input
          type="text"
          placeholder="Bag name..."
          value={newBagName}
          onChange={(e) => setNewBagName(e.target.value)}
        />
        <button onClick={createBag}>Create Bag</button>
      </div>

      {/* Bag selector */}
      <div className="bag-selector-section">
        <h2>My Bags</h2>

        {bags.length === 0 ? (
          <p>No bags created yet.</p>
        ) : (
          <div className="bag-button-list">
            {bags.map(bag => (
              <button
                key={bag.id}
                onClick={() => setSelectedBagId(bag.id)}
                className={selectedBagId === bag.id ? "active-bag-button" : "bag-button"}
              >
                {bag.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected bag */}
      <div className="selected-bag-section">
        <h2>{selectedBag ? selectedBag.name : "Select a Bag"}</h2>

        {!selectedBag ? (
          <p>Create or select a bag first.</p>
        ) : selectedBagDiscs.length === 0 ? (
          <p>No discs in this bag yet.</p>
        ) : (
          <div className="bag-disc-list">
            {selectedBagDiscs.map(disc => (
              <div key={disc.id} className="bag-disc-card">
                <h3>{disc.brand} {disc.name}</h3>
                <p>
                  Speed: {disc.speed} | Glide: {disc.glide} | Turn: {disc.turn} | Fade: {disc.fade}
                </p>
                <button onClick={() => removeDiscFromBag(disc.id)}>
                  Remove from Bag
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}