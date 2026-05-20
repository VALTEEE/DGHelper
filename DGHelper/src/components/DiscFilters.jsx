import { useState } from "react";
import { Range } from "react-range";

const STEP = 1;

const SPEED_MIN = 1;
const SPEED_MAX = 15;

const GLIDE_MIN = 1;
const GLIDE_MAX = 7;

const TURN_MIN = -5;
const TURN_MAX = 2;

const FADE_MIN = -1;
const FADE_MAX = 6;

export default function DiscFilters({ onChange }) {
  const [filters, setFilters] = useState({
    brand: "",
    speedRange: [SPEED_MIN, SPEED_MAX],
    glideRange: [GLIDE_MIN, GLIDE_MAX],
    turnRange: [TURN_MIN, TURN_MAX],
    fadeRange: [FADE_MIN, FADE_MAX],
    stability: ""
  });

  function updateFilter(key, value) {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    onChange({
      brand: newFilters.brand,
      speedMin: newFilters.speedRange[0],
      speedMax: newFilters.speedRange[1],
      glideMin: newFilters.glideRange[0],
      glideMax: newFilters.glideRange[1],
      turnMin: newFilters.turnRange[0],
      turnMax: newFilters.turnRange[1],
      fadeMin: newFilters.fadeRange[0],
      fadeMax: newFilters.fadeRange[1],
      stability: newFilters.stability
    });
  }

  return (
    <div className="disc-filter-div">
      <h3>Filters</h3>

      <label className="brand-filter">Brand</label>
      <select
        className="brand-option"
        value={filters.brand}
        onChange={e => updateFilter("brand", e.target.value)}
      >
        <option value="">All</option>
        <option value="Innova">Innova</option>
        <option value="MVP">MVP</option>
        <option value="Discraft">Discraft</option>
        <option value="Latitude 64">Latitude 64</option>
        <option value="Dynamic Discs">Dynamic Discs</option>
        <option value="Axiom">Axiom</option>
        <option value="Discmania">Discmania</option>
        <option value="Prodigy">Prodigy</option>
        <option value="Westside">Westside</option>
        <option value="Clash">Clash</option>
      </select>

      <label className="speed-filter">
        Speed: {filters.speedRange[0]} - {filters.speedRange[1]}
      </label>
      <Range
        step={STEP}
        min={SPEED_MIN}
        max={SPEED_MAX}
        values={filters.speedRange}
        onChange={values => updateFilter("speedRange", values)}
        renderTrack={({ props, children }) => (
          <div {...props} className="range-track">
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className="range-thumb" />
        )}
      />

      <label className="glide-filter">
        Glide: {filters.glideRange[0]} - {filters.glideRange[1]}
      </label>
      <Range
        step={STEP}
        min={GLIDE_MIN}
        max={GLIDE_MAX}
        values={filters.glideRange}
        onChange={values => updateFilter("glideRange", values)}
        renderTrack={({ props, children }) => (
          <div {...props} className="range-track">
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className="range-thumb" />
        )}
      />

      <label className="turn-filter">
        Turn: {filters.turnRange[0]} - {filters.turnRange[1]}
      </label>
      <Range
        step={STEP}
        min={TURN_MIN}
        max={TURN_MAX}
        values={filters.turnRange}
        onChange={values => updateFilter("turnRange", values)}
        renderTrack={({ props, children }) => (
          <div {...props} className="range-track">
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className="range-thumb" />
        )}
      />

      <label className="fade-filter">
        Fade: {filters.fadeRange[0]} - {filters.fadeRange[1]}
      </label>
      <Range
        step={STEP}
        min={FADE_MIN}
        max={FADE_MAX}
        values={filters.fadeRange}
        onChange={values => updateFilter("fadeRange", values)}
        renderTrack={({ props, children }) => (
          <div {...props} className="range-track">
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className="range-thumb" />
        )}
      />

      <label className="stability-filter">Stability</label>
      <select
        className="stability-option"
        value={filters.stability}
        onChange={e => updateFilter("stability", e.target.value)}
      >
        <option value="">All</option>
        <option value="Understable">Understable</option>
        <option value="Stable">Stable</option>
        <option value="Overstable">Overstable</option>
      </select>
    </div>
  );
}