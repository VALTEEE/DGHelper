const axios = require("axios");
const formatDisc = require("../models/discModel");

let cachedDiscs = [];
let lastFetch = 0;
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

async function getDiscsFromService() {
  if (Date.now() - lastFetch < CACHE_TIME && cachedDiscs.length > 0) {
    return cachedDiscs;
  }

  const response = await axios.get("https://discit-api.fly.dev/disc");
  cachedDiscs = response.data.map(formatDisc);
  lastFetch = Date.now();

  return cachedDiscs;
}

module.exports = getDiscsFromService;