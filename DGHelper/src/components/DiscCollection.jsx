export default function DiscCollection({
  ownedDiscs,
  selectedBag,
  addDiscToBag,
  removeFromCollection
}) {
  return (
    // Owned collection
    <div className="collection-section">
      <h2>My Collection</h2>

      {ownedDiscs.length === 0 ? (
        <p>No discs added yet.</p>
      ) : (
        <div className="owned-disc-list">
          {ownedDiscs.map(disc => (
            <div key={disc.id} className="owned-disc-card">
              <h3>{disc.brand} {disc.name}</h3>
              <p>
                Speed: {disc.speed} | Glide: {disc.glide} | Turn: {disc.turn} | Fade: {disc.fade}
              </p>

              {selectedBag && (
                <button onClick={() => addDiscToBag(disc.id)}>
                  Add to {selectedBag.name}
                </button>
              )}

              <button onClick={() => removeFromCollection(disc.id)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}