function formatDisc(disc) {
  return {
    id: disc.id,
    name: disc.name,
    brand: disc.brand,
    category: disc.category,
    speed: disc.speed,
    glide: disc.glide,
    turn: disc.turn,
    fade: disc.fade,
    stability: disc.stability
  };
}

module.exports = formatDisc;