/**
 * Flight model — predicts how a disc actually flies for a given player
 * Based on speed mismatch between disc speed requirement and player's throw power
 */

// How much power (speed units) each category requires per meter thrown
const CATEGORY_MULTIPLIER = {
  "Distance Driver": 1.0,
  "Fairway Driver": 0.9,
  "Midrange":       0.75,
  "Putter":         0.65,
};

// Default if category is unknown
const DEFAULT_MULTIPLIER = 1.0;

/**
 * Given a player's max throw distance and a disc, calculate how the disc
 * will actually behave for that player.
 *
 * @param {number} throwDistance   - Player's max throw in meters (from profile)
 * @param {object} disc            - { speed, glide, turn, fade, category }
 * @returns {object}               - Flight prediction with labels and explanation
 */
export function calculateFlight(throwDistance, disc) {
  const { speed, glide, turn, fade, category } = disc;

  // Step 1: how much speed does this disc need from the player?
  const multiplier = CATEGORY_MULTIPLIER[category] ?? DEFAULT_MULTIPLIER;
  const requiredSpeed = (throwDistance / 10) * multiplier;

  // Step 2: how well does the player match the disc's requirement?
  const speedDifference = speed - requiredSpeed;
  //  positive = disc needs more power than player has → flies more overstable
  //  negative = disc needs less power → flies more understable

  // Step 3: adjust turn and fade based on speed mismatch
  const actualTurn = Math.max(-5, Math.min(5,  turn - speedDifference));
  const actualFade = Math.max(0,  Math.min(8,  fade + speedDifference));

  // Step 4: effective distance (glide scales how far the disc actually goes)
  const glideMultiplier = glide / 5;
  const effectiveDistance = Math.round(throwDistance * glideMultiplier);

  // Step 5: human-readable stability label
  const stabilityLabel = getStabilityLabel(actualTurn, actualFade);

  // Step 6: plain-English flight description
  const flightDescription = describeFlightPath(actualTurn, actualFade);

  return {
    requiredSpeed:     Math.round(requiredSpeed * 10) / 10,
    speedDifference:   Math.round(speedDifference * 10) / 10,
    actualTurn:        Math.round(actualTurn * 10) / 10,
    actualFade:        Math.round(actualFade * 10) / 10,
    effectiveDistance,
    stabilityLabel,
    flightDescription,
  };
}

/**
 * Given a hole distance and player throw distance,
 * check if the disc can actually reach the basket.
 *
 * @param {number} holeDistance      - Hole distance in meters
 * @param {number} effectiveDistance - How far this disc goes for this player
 * @returns {string}                 - "one-throw", "two-throw", or "out-of-range"
 */
export function throwsNeeded(holeDistance, effectiveDistance) {
  if (effectiveDistance <= 0) return "out-of-range";
  if (effectiveDistance >= holeDistance) return "one-throw";
  if (effectiveDistance * 2 >= holeDistance) return "two-throw";
  return "multi-throw";
}

/**
 * Given multiple discs from the player's bag and a hole,
 * return the best options ranked by suitability.
 *
 * @param {object[]} discs       - Player's owned discs
 * @param {number}   throwDistance
 * @param {number}   holeDistance
 * @returns {object[]}            - Sorted array of { disc, flight, throws, score }
 */
export function rankDiscsForHole(discs, throwDistance, holeDistance) {
  if (!discs || discs.length === 0 || !throwDistance) return [];

  return discs
    .map((disc) => {
      const flight = calculateFlight(throwDistance, disc);
      const throws = throwsNeeded(holeDistance, flight.effectiveDistance);

      // Score: lower is better
      // Penalise overstable (high fade) and understable (very negative turn)
      // Reward discs that reach in one throw and have neutral flight
      let score = Math.abs(flight.actualTurn) + flight.actualFade;
      if (throws === "one-throw")   score -= 5;
      if (throws === "two-throw")   score += 2;
      if (throws === "multi-throw") score += 6;

      return { disc, flight, throws, score };
    })
    .sort((a, b) => a.score - b.score);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStabilityLabel(actualTurn, actualFade) {
  const net = actualFade + actualTurn; // positive = overstable, negative = understable

  if (net >= 4)  return "Very overstable";
  if (net >= 2)  return "Overstable";
  if (net >= 0)  return "Stable / Neutral";
  if (net >= -2) return "Understable";
  return "Very understable";
}

function describeFlightPath(actualTurn, actualFade) {
  const parts = [];

  if (actualTurn <= -3) {
    parts.push("turns hard right early in flight");
  } else if (actualTurn <= -1.5) {
    parts.push("turns right in the middle of flight");
  } else if (actualTurn <= -0.5) {
    parts.push("slight right turn at high speed");
  }

  if (actualFade >= 4) {
    parts.push("fades hard left at the end");
  } else if (actualFade >= 2) {
    parts.push("reliable left fade at the end");
  } else if (actualFade >= 0.5) {
    parts.push("slight fade left at the end");
  } else {
    parts.push("stays fairly straight throughout");
  }

  return parts.length > 0
    ? parts.join(", then ") + "."
    : "Flies straight with minimal movement.";
}