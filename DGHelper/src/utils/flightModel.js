/**
 * Flight model — predicts how a disc actually flies for a given player
 * Based on speed mismatch between disc speed requirement and player's throw power
 */

// How much power (speed units) each category requires per meter thrown
const CATEGORY_MULTIPLIER = {
  "Distance Driver": 1.0,
  "Hybrid Driver":   0.95,
  "Control Driver":  0.88,
  "Midrange":        0.75,
  "Approach Discs":  0.68,
  "Putter":          0.65,
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
  const speed = Number(disc.speed);
  const glide = Number(disc.glide);
  const turn = Number(disc.turn);
  const fade = Number(disc.fade);
  const { category } = disc;

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
  const glideMultiplier = glide / 6;
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
const PUTT_RANGE = 10;    // within 10m = easy putt
const APPROACH_RANGE = 40; // within 40m = comfortable approach

export function throwsNeeded(holeDistance, effectiveDistance) {
  if (effectiveDistance <= 0) return "out-of-range";

  const remaining = holeDistance - effectiveDistance;

  // Lands within putting range (including overshoot)
  if (remaining <= PUTT_RANGE) return "one-throw";

  // One throw leaves a comfortable approach/putt
  if (remaining <= APPROACH_RANGE) return "two-throw";

  // Two throws can get within putting range
  if (effectiveDistance * 2 >= holeDistance - PUTT_RANGE) return "two-throw";

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
export function rankDiscsForHole(discs, throwDistance, holeDistance, obstacles) {
  if (!discs || discs.length === 0 || !throwDistance) return [];

  const obstacleLevel = getObstacleLevel(obstacles); // 0, 1, 2, or 3

  return discs
    .map((disc) => {
      const wornDisc = applyWear(disc);
      const flight = calculateFlight(throwDistance, wornDisc);
      const throws = throwsNeeded(holeDistance, flight.effectiveDistance);

      let score = Math.abs(flight.actualTurn) + flight.actualFade;

      const remaining = holeDistance - flight.effectiveDistance;

      if (remaining <= PUTT_RANGE) {
        const overshoot = Math.max(0, flight.effectiveDistance - holeDistance);
        score += overshoot / 15;
      } else if (remaining <= APPROACH_RANGE) {
        score += 1 + (remaining - PUTT_RANGE) / 30;
      } else if (throws === "two-throw") {
        score += 2 + (remaining - APPROACH_RANGE) / 20;
      } else {
        score += 8 + remaining / 20;
      }

      const effortRatio = flight.effectiveDistance > 0
        ? Math.min(1, holeDistance / flight.effectiveDistance)
        : 1;
      score -= (1 - effortRatio) * 2;

      // Obstacle penalty: understable discs (high negative turn) are risky near trees
      // obstacleLevel 1=light, 2=moderate, 3=heavy
      const turnRisk = Math.max(0, -flight.actualTurn);
      score += obstacleLevel * turnRisk * 0.4;

      return { disc, flight, throws, score };
    })
    .sort((a, b) => a.score - b.score);
}



export function getThrowRecommendation(flight, disc, holeDistance, handedness, weather, holeBearing, obstacles) {
  const isRightHanded = handedness !== "left";
  const fadeDir = isRightHanded ? "left" : "right";
  const turnDir = isRightHanded ? "right" : "left";

  const netStability = flight.actualFade + flight.actualTurn;
  const discSpeed = Number(disc.speed);

  // Calculate headwind early so it shifts the actual recommendation
  let headwindBonus = 0;
if (weather && holeBearing !== null && holeBearing !== undefined) {
  const windSpeed = weather.wind_speed_10m || 0;
  const windFrom = weather.wind_direction_10m ?? 0;
  if (windSpeed >= 3) {
    const relAngle = (windFrom - holeBearing + 360) % 360;
    const headwind = Math.cos((relAngle * Math.PI) / 180) * windSpeed;
    if (headwind > 8)       headwindBonus =  1.5;
    else if (headwind > 5)  headwindBonus =  0.75;
    else if (headwind < -8) headwindBonus = -1.5;
    else if (headwind < -5) headwindBonus = -0.75;
  }
}

let obstacleBonus = 0;
const obstacleLevel = getObstacleLevel(obstacles);
if (obstacleLevel === 3)      obstacleBonus = 1.0;
else if (obstacleLevel === 2) obstacleBonus = 0.5;

const adjustedStability = netStability + headwindBonus + obstacleBonus;

  function withWind(result) {
    const windNote = getWindNote(weather, holeBearing, isRightHanded);
    const obstacleNote = getObstacleNote(obstacles);
    return { ...result, windNote, obstacleNote };
  }

  if (holeDistance <= 20) {
    return withWind({
      primary: { throw: "putt", release: null, label: "Putt", reason: "Within putting range — smooth putting motion." },
      secondary: null,
    });
  }

  const gyroscopicBonus = (discSpeed / 14) * 0.3;
  const baseHoldRatio = Math.max(0, 1 - netStability / 8);
  const finalHoldRatio = Math.min(1, baseHoldRatio * (1 + gyroscopicBonus));
  const returnStrength = Math.max(0, netStability / 6);

  function anhyzerReason() {
    const pct = Math.round(finalHoldRatio * 100);
    let holdDesc;
    if (pct >= 90) holdDesc = `holds the ${turnDir} curve almost the whole flight`;
    else if (pct >= 70) holdDesc = `curves ${turnDir} for most of the flight`;
    else if (pct >= 40) holdDesc = `curves ${turnDir} for roughly half the flight`;
    else holdDesc = `briefly goes ${turnDir} then snaps back hard`;

    let returnDesc = "";
    if (returnStrength > 0.5) returnDesc = `, then fades hard ${fadeDir}`;
    else if (returnStrength > 0.2) returnDesc = `, then gently fades ${fadeDir}`;
    else if (returnStrength > 0) returnDesc = `, slight ${fadeDir} fade at the end`;

    const gyroNote = discSpeed >= 10 ? ` High-speed disc holds the angle longer.` : "";
    return `Anhyzer release — disc ${holdDesc}${returnDesc}.${gyroNote}`;
  }

  // All branches now use adjustedStability instead of netStability
  if (adjustedStability < -2 && holeDistance >= 70) {
    return withWind({
      primary: {
        throw: "backhand", release: "hyzerflip", label: "Backhand Hyzerflip",
        reason: `Start on hyzer — this very understable disc flips to flat mid-flight, curving ${turnDir} for maximum distance.`,
      },
      secondary: {
        throw: "backhand", release: "anhyzer", label: "Backhand Anhyzer",
        reason: anhyzerReason(), holdRatio: finalHoldRatio, returnStrength,
      },
    });
  }

  if (adjustedStability < 0) {
    return withWind({
      primary: {
        throw: "backhand", release: "anhyzer", label: "Backhand Anhyzer",
        reason: anhyzerReason(), holdRatio: finalHoldRatio, returnStrength,
      },
      secondary: null,
    });
  }

  if (adjustedStability < 1) {
    return withWind({
      primary: {
        throw: "backhand", release: "flat", label: "Backhand Flat",
        reason: `Neutral disc — flat release gives a straight flight with a gentle ${fadeDir} fade at the end.`,
      },
      secondary: null,
    });
  }

  if (adjustedStability < 2) {
    return withWind({
      primary: {
        throw: "backhand", release: "flat", label: "Backhand Flat",
        reason: `Moderately overstable — flat release gives a reliable line with a ${fadeDir} fade.`,
      },
      secondary: {
        throw: "backhand", release: "hyzer", label: "Backhand Hyzer",
        reason: `Hyzer release for a stronger ${fadeDir} curve — useful into headwinds or tight fairways.`,
      },
    });
  }

  if (adjustedStability < 4) {
    return withWind({
      primary: {
        throw: "forehand", release: "hyzer", label: "Forehand Hyzer",
        reason: `Overstable disc — the natural fade becomes a ${turnDir} curve on forehand. Direct and reliable.`,
      },
      secondary: {
        throw: "backhand", release: "hyzer", label: "Backhand Hyzer",
        reason: `Hyzer backhand amplifies the fade for a strong ${fadeDir} curve shot.`,
      },
    });
  }

  return withWind({
    primary: {
      throw: "forehand", release: "hyzer", label: "Forehand Hyzer",
      reason: `Very overstable — forehand is the most controlled option. Strong ${turnDir} curve with a hard finish.`,
    },
    secondary: null,
  });
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


//------------Weather and wind effects----------------//

export function getWindNote(weather, holeBearing, isRightHanded) {
  if (!weather || holeBearing === null || holeBearing === undefined) return "";

  const windSpeed = weather.wind_speed_10m || 0;
  const windFrom = weather.wind_direction_10m ?? 0;

  if (windSpeed < 3) return ""; // Calm — no note needed

  const relAngle = (windFrom - holeBearing + 360) % 360;
  const relAngleRad = (relAngle * Math.PI) / 180;

  // Positive headwind = wind coming towards thrower (against the disc)
  // Positive crosswind = wind from the right of the fairway
  const headwind = Math.cos(relAngleRad) * windSpeed;
  const crosswind = Math.sin(relAngleRad) * windSpeed;

  const fadeDir = isRightHanded ? "left" : "right";
  const turnDir = isRightHanded ? "right" : "left";

  if (headwind > 8)
    return `⚠️ Strong headwind ${Math.round(headwind)}m/s — keep disc low, add hyzer to prevent rollover.`;
  if (headwind > 5)
    return `🌬️ Headwind ${Math.round(headwind)}m/s — disc acts more overstable, slight hyzer helps.`;
  if (headwind < -8)
    return `💨 Strong tailwind ${Math.round(-headwind)}m/s — disc carries much further, risk of overshoot.`;
  if (headwind < -5)
    return `💨 Tailwind ${Math.round(-headwind)}m/s — disc goes further than the distance suggests.`;
  if (crosswind > 5)
    return `↙️ Right crosswind ${Math.round(crosswind)}m/s — aim more ${fadeDir} to compensate.`;
  if (crosswind < -5)
    return `↘️ Left crosswind ${Math.round(-crosswind)}m/s — aim more ${turnDir} to compensate.`;

  return "";
}

//--------------Disc Wear---------------------//

function applyWear(disc) {
  const wear = disc.wear || 0;
  return {
    ...disc,
    turn: Number(disc.turn) + (wear * 0.5),
    fade: Math.max(0, Number(disc.fade) + (wear * 0.25)),
  };
}

function getObstacleLevel(obstacles) {
  if (!obstacles || obstacles.length === 0) return 0;
  if (obstacles.some((o) => o.severity === "heavy"))    return 3;
  if (obstacles.some((o) => o.severity === "moderate")) return 2;
  return 1;
}

export function getObstacleNote(obstacles) {
  if (!obstacles || obstacles.length === 0) return "";

  const heavy    = obstacles.filter((o) => o.severity === "heavy");
  const moderate = obstacles.filter((o) => o.severity === "moderate");

  if (heavy.length > 0) {
    return `🌲 Heavy obstacles: ${heavy.map((o) => o.note).join(" · ")} — accuracy over distance.`;
  }
  if (moderate.length > 0) {
    return `🌳 Obstacles: ${moderate.map((o) => o.note).join(" · ")} — choose a reliable line.`;
  }
  return "";
}