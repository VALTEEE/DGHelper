export default function DiscSearch({
  searchTerm,
  setSearchTerm,
  searchResults,
  addToCollection
}) {

  // Function to create correct image URL for each disc
  function createDiscLink(name) {
    let nameFormatted;

    if (name === "<- Tilt") {
      nameFormatted = "tilt";
    } else {
      nameFormatted = name
        .replace(/[-<>]/g, "")  // remove -, <, >
        .replace(/\s+/g, "-")   // replace spaces with "-"
        .toLowerCase();
    }

    return `https://trydiscs-prod.s3.amazonaws.com/disc_images/${nameFormatted}.webp`;
  }

  return (
    // Search discs from database
    <div className="search-section">
      <h2>Add Disc To Collection</h2>

      <input
        type="text"
        placeholder="Search disc by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="disc-search-input"
      />

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(disc => (
            <div key={disc.id} className="search-result-card">

              {/* Disc image */}
              <img
                src={createDiscLink(disc.name)}
                alt={disc.name}
                className="search-disc-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/no-disc-image.png";
                }}
              />

              {/* Disc name */}
              <span>{disc.brand} {disc.name}</span>

              {/* Add button */}
              <button
                className="AddButtonBag"
                onClick={() => addToCollection(disc)}
              >
                Add
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}