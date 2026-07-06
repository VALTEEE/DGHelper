import { useState } from "react";
import DiscList from "../components/DiscList";
import DiscFilters from "../components/DiscFilters";
import allDiscsData from "../data/discs";

export default function Discs() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const limit = 24;

  // --- Step 2: Filter locally ---
  let filtered = allDiscsData;

  if (filters.brand) {
    const brands = filters.brand.split(",");
    filtered = filtered.filter(d => brands.includes(d.brand));
  }
  if (filters.speedMin !== undefined) filtered = filtered.filter(d => Number(d.speed) >= filters.speedMin);
  if (filters.speedMax !== undefined) filtered = filtered.filter(d => Number(d.speed) <= filters.speedMax);
  if (filters.glideMin !== undefined) filtered = filtered.filter(d => Number(d.glide) >= filters.glideMin);
  if (filters.glideMax !== undefined) filtered = filtered.filter(d => Number(d.glide) <= filters.glideMax);
  if (filters.turnMin  !== undefined) filtered = filtered.filter(d => Number(d.turn)  >= filters.turnMin);
  if (filters.turnMax  !== undefined) filtered = filtered.filter(d => Number(d.turn)  <= filters.turnMax);
  if (filters.fadeMin  !== undefined) filtered = filtered.filter(d => Number(d.fade)  >= filters.fadeMin);
  if (filters.fadeMax  !== undefined) filtered = filtered.filter(d => Number(d.fade)  <= filters.fadeMax);
  if (filters.stability) filtered = filtered.filter(d => d.stability === filters.stability);

  // --- Step 3: Paginate locally ---
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const start = (page - 1) * limit;
  const pageDiscs = filtered.slice(start, start + limit);

  function handleFiltersChange(newFilters) {
    setFilters(newFilters);
    setPage(1); // always go back to page 1 when filters change
  }

  return (
    <div style={{ display: "flex" }}>
      <DiscFilters onChange={handleFiltersChange} />

      <div style={{ marginLeft: "20px", flex: 1 }}>
        <h2>Disc List</h2>
        <p>Showing page {page} of {totalPages} ({totalItems} discs)</p>

        <DiscList discs={pageDiscs} />

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span className="pagination-info">Page {page} / {totalPages}</span>

            <button
              className="pagination-button"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}