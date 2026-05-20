import { useEffect, useState } from "react";
import DiscList from "../components/DiscList";
import DiscFilters from "../components/DiscFilters";

export default function Discs() {
  const [discs, setDiscs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({});

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Refetch when filters or page changes
  useEffect(() => {
    fetchDiscs();
  }, [filters, page]);

  // If filters change, go back to page 1
  function handleFiltersChange(newFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  async function fetchDiscs() {
    setLoading(true);

    const params = new URLSearchParams();

    // Pagination params
    params.append("page", page);
    params.append("limit", limit);

    // Filter params
    if (filters.brand) params.append("brand", filters.brand);

    if (filters.speedMin !== undefined) params.append("speedMin", filters.speedMin);
    if (filters.speedMax !== undefined) params.append("speedMax", filters.speedMax);

    if (filters.glideMin !== undefined) params.append("glideMin", filters.glideMin);
    if (filters.glideMax !== undefined) params.append("glideMax", filters.glideMax);

    if (filters.turnMin !== undefined) params.append("turnMin", filters.turnMin);
    if (filters.turnMax !== undefined) params.append("turnMax", filters.turnMax);

    if (filters.fadeMin !== undefined) params.append("fadeMin", filters.fadeMin);
    if (filters.fadeMax !== undefined) params.append("fadeMax", filters.fadeMax);

    if (filters.stability) params.append("stability", filters.stability);

    try {
      const res = await fetch(`http://localhost:3000/discs?${params.toString()}`);
      const data = await res.json();

      setDiscs(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Failed to fetch discs:", error);
      setDiscs([]);
      setTotalPages(1);
      setTotalItems(0);
    }

    setLoading(false);
  }

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar filters */}
      <DiscFilters onChange={handleFiltersChange} />

      {/* Disc list + pagination */}
      <div style={{ marginLeft: "20px", flex: 1 }}>
        <h2>Disc List</h2>

        {!loading && (
          <p>
            Showing page {page} of {totalPages} ({totalItems} discs)
          </p>
        )}

        {loading ? <div>Loading discs...</div> : <DiscList discs={discs} />}

        {/* Pagination controls */}
        {!loading && totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span className="pagination-info">
              Page {page} / {totalPages}
            </span>

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