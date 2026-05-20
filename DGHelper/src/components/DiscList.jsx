export default function DiscList({ discs }) {

  // Function to create correct image URL for each disc
  function createDiscLink(brand, name) {
    // Special case for "<- Tilt"
    let nameFormatted;
    if (name === "<- Tilt") {
      nameFormatted = "tilt";
    } else {
      // Generic sanitization for all other discs
      nameFormatted = name
        .replace(/[-<>]/g, "")  // remove -, <, >
        .replace(/\s+/g, "-")   // replace spaces with "-"
        .toLowerCase();
    }

    return `https://trydiscs-prod.s3.amazonaws.com/disc_images/${nameFormatted}.webp`;
  }

  // If no discs found
  if (!discs || discs.length === 0) {
    return <p>No discs found</p>;
  }

  return (
    // Grid container (controls 4 items per row)
    <div className="disc-grid">

      {discs.map(disc => (
        // Each disc card
        <div key={disc.id} className="disc-card">

          {/* Disc name + brand */}
          <h3>{disc.brand} {disc.name}</h3>

          {/* Disc image */}
          <img
            src={createDiscLink(disc.brand, disc.name)}
            alt={`${disc.brand} ${disc.name}`}
            className="disc-image"
          onError={(e) => {
            e.target.onerror = null; // prevents infinite loop
            e.target.src = "/images/no-disc-image.png"
  }}
/>
          {/* Flight Numbers */}
          <div className="flight-numbers">
            <span className="flight-stat"><strong> Speed:</strong> {disc.speed ?? '-'}</span>
            <span className="flight-stat"><strong> Glide:</strong> {disc.glide ?? '-'}</span>
            <span className="flight-stat"><strong> Turn:</strong> {disc.turn ?? '-'}</span>
            <span className="flight-stat"><strong> Fade:</strong> {disc.fade ?? '-'}</span>
            <br />
            <span className="flight-stat"><strong> Stability:</strong> {disc.stability ?? '-'}</span>
          </div>

          {/* Link to full gallery */}
          <a
            href={createDiscLink(disc.brand, disc.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="disc-link"
          >
            View Disc Gallery
          </a>

        </div>
      ))}

    </div>
  );
}