const db = require("../database/db");

function getBag(req, res) {
  const row = db
    .prepare("SELECT owned_discs, bags FROM user_bags WHERE user_id = ?")
    .get(req.user.id);

  if (!row) {
    db.prepare(
      "INSERT INTO user_bags (user_id, owned_discs, bags) VALUES (?, '[]', '[]')"
    ).run(req.user.id);

    return res.json({ ownedDiscs: [], bags: [] });
  }

  res.json({
    ownedDiscs: JSON.parse(row.owned_discs),
    bags: JSON.parse(row.bags),
  });
}

function saveBag(req, res) {
  const { ownedDiscs, bags } = req.body;

  if (!Array.isArray(ownedDiscs) || !Array.isArray(bags)) {
    return res.status(400).json({ error: "ownedDiscs and bags must be arrays" });
  }

  db.prepare(`
    INSERT INTO user_bags (user_id, owned_discs, bags, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      owned_discs = excluded.owned_discs,
      bags = excluded.bags,
      updated_at = CURRENT_TIMESTAMP
  `).run(req.user.id, JSON.stringify(ownedDiscs), JSON.stringify(bags));

  res.json({ ownedDiscs, bags });
}

module.exports = { getBag, saveBag };
