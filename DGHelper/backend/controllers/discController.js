const getDiscsFromService = require("../services/discService");
const paginate = require("../utils/paginate");

const ALLOWED_BRANDS = [
  "Innova",
  "MVP",
  "Discraft",
  "Latitude 64",
  "Dynamic Discs",
  "Axiom",
  "Discmania",
  "Prodigy",
  "Westside",
  "Clash"
];

async function getAllDiscs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 24;

    const {
      brand,
      speedMin,
      speedMax,
      glideMin,
      glideMax,
      turnMin,
      turnMax,
      fadeMin,
      fadeMax,
      stability
    } = req.query;

    let discs = await getDiscsFromService();

    discs = discs.filter(d =>
      ALLOWED_BRANDS.some(
        allowed => allowed.toLowerCase().trim() === d.brand.toLowerCase().trim()
      )
    );

    if (brand) {
      const brands = brand.split(",");
      discs = discs.filter(d => brands.includes(d.brand));
    }

    if (speedMin !== undefined) {
      discs = discs.filter(d => Number(d.speed) >= Number(speedMin));
    }
    if (speedMax !== undefined) {
      discs = discs.filter(d => Number(d.speed) <= Number(speedMax));
    }

    if (glideMin !== undefined) {
      discs = discs.filter(d => Number(d.glide) >= Number(glideMin));
    }
    if (glideMax !== undefined) {
      discs = discs.filter(d => Number(d.glide) <= Number(glideMax));
    }

    if (turnMin !== undefined) {
      discs = discs.filter(d => Number(d.turn) >= Number(turnMin));
    }
    if (turnMax !== undefined) {
      discs = discs.filter(d => Number(d.turn) <= Number(turnMax));
    }

    if (fadeMin !== undefined) {
      discs = discs.filter(d => Number(d.fade) >= Number(fadeMin));
    }
    if (fadeMax !== undefined) {
      discs = discs.filter(d => Number(d.fade) <= Number(fadeMax));
    }

    if (stability) {
      discs = discs.filter(d => d.stability == stability);
    }

    const result = paginate(discs, page, limit);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch discs" });
  }
}

module.exports = { getAllDiscs };