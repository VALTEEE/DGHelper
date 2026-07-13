import allDiscsData from "../data/discs";
import { useEffect, useRef, useState } from "react";
import DiscSearch from "../components/DiscSearch";
import DiscCollection from "../components/DiscCollection";
import BagManager from "../components/BagManager";
import { useAuth } from "../context/AuthContext";
import { fetchBag, saveBag } from "../utils/api";
import Login from "./Login";

export default function YourBag() {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [ownedDiscs, setOwnedDiscs] = useState([]);
  const [bags, setBags] = useState([]);
  const [newBagName, setNewBagName] = useState("");
  const [selectedBagId, setSelectedBagId] = useState(null);
  const [bagLoading, setBagLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState("");
  const allDiscs = allDiscsData;

  const saveTimeoutRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    hasLoadedRef.current = false;

    async function loadBag() {
      setBagLoading(true);
      setSyncStatus("");

      try {
        const data = await fetchBag();
        let nextOwned = data.ownedDiscs || [];
        let nextBags = data.bags || [];

        // One-time migration: if account is empty but localStorage has data, sync it up
        const localOwned = localStorage.getItem("ownedDiscs");
        const localBags = localStorage.getItem("bags");
        const hasLocalData =
          (localOwned && JSON.parse(localOwned).length > 0) ||
          (localBags && JSON.parse(localBags).length > 0);

        if (nextOwned.length === 0 && nextBags.length === 0 && hasLocalData) {
          nextOwned = localOwned ? JSON.parse(localOwned) : [];
          nextBags = localBags ? JSON.parse(localBags) : [];
          await saveBag(nextOwned, nextBags);
          setSyncStatus("Local bag synced to your account");
        }

        setOwnedDiscs(nextOwned);
        setBags(nextBags);
        if (nextBags.length > 0) setSelectedBagId(nextBags[0].id);
      } catch (error) {
        console.error("Failed to load bag:", error);
        setSyncStatus("Could not load saved bag");
      } finally {
        hasLoadedRef.current = true;
        setBagLoading(false);
      }
    }

    loadBag();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    if (!isAuthenticated) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveBag(ownedDiscs, bags);
        setSyncStatus("Saved to your account");
      } catch (error) {
        console.error("Failed to save bag:", error);
        setSyncStatus("Save failed — try again");
      }
    }, 600);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [ownedDiscs, bags, isAuthenticated]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const results = allDiscs.filter((disc) =>
      `${disc.brand} ${disc.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results.slice(0, 10));
  }, [searchTerm, allDiscs]);

  function handleAddFromSearch(disc) {
    if (!ownedDiscs.some((d) => d.id === disc.id)) {
     setOwnedDiscs((prev) => [...prev, { ...disc, wear: 0 }]);
   }
    if (selectedBagId) {
      setBags((prev) =>
        prev.map((bag) =>
          bag.id === selectedBagId && !bag.discIds.includes(disc.id)
            ? { ...bag, discIds: [...bag.discIds, disc.id] }
            : bag
        )
      );
    }
    setSearchTerm("");
  }

  function removeFromCollection(discId) {
    setOwnedDiscs(ownedDiscs.filter((d) => d.id !== discId));
    setBags(
      bags.map((bag) => ({
        ...bag,
        discIds: bag.discIds.filter((id) => id !== discId),
      }))
    );
  }

  function createBag() {
    if (!newBagName.trim()) return;
    const newBag = { id: Date.now(), name: newBagName, discIds: [] };
    setBags((prev) => [...prev, newBag]);
    setSelectedBagId(newBag.id);
    setNewBagName("");
  }

  function updateDiscWear(discId, newWear) {
   const clamped = Math.max(-3, Math.min(0, newWear));
    setOwnedDiscs((prev) =>
      prev.map((d) => (d.id === discId ? { ...d, wear: clamped } : d))
    );
  }

  function deleteBag(bagId) {
    const remaining = bags.filter((b) => b.id !== bagId);
    setBags(remaining);
    if (selectedBagId === bagId) {
      setSelectedBagId(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  function addDiscToBag(discId) {
    setBags(
      bags.map((bag) =>
        bag.id === selectedBagId && !bag.discIds.includes(discId)
          ? { ...bag, discIds: [...bag.discIds, discId] }
          : bag
      )
    );
  }



  function removeDiscFromBag(discId) {
    setBags(
      bags.map((bag) =>
        bag.id === selectedBagId
          ? { ...bag, discIds: bag.discIds.filter((id) => id !== discId) }
          : bag
      )
    );
  }

  // --- Locked state for guests ---
  if (!isAuthenticated) {
    return (
      <div className="your-bag-page">
        <div className="bag-locked-state">
          <div className="bag-locked-icon">🔒</div>
          <h2 className="bag-locked-title">Bag feature is locked</h2>
          <p className="bag-locked-desc">
            Log in to create bags, track your disc collection and get course recommendations.
          </p>
          <button className="bag-locked-login-btn" onClick={() => setShowLogin(true)}>
            Log in
          </button>
        </div>
        {showLogin && <Login onClose={() => setShowLogin(false)} />}
      </div>
    );
  }

  const selectedBag = bags.find((bag) => bag.id === selectedBagId);
  const selectedBagDiscs = selectedBag
    ? ownedDiscs.filter((disc) => selectedBag.discIds.includes(disc.id))
    : [];

  return (
    <div className="your-bag-page">
      <div className="bag-page-header">
        <h1>Your Bag</h1>
        <div className="bag-page-meta">
          {syncStatus && <p className="bag-sync-status">{syncStatus}</p>}
        </div>
      </div>

      {bagLoading ? (
        <div className="bag-loading">
          <p>Loading your bag...</p>
        </div>
      ) : (
        <div className="bag-workspace">
          <div className="search-collection-panel">
            <DiscSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchResults={searchResults}
              onAddDisc={handleAddFromSearch}
              ownedDiscs={ownedDiscs}
              selectedBag={selectedBag}
            />
            <DiscCollection
              ownedDiscs={ownedDiscs}
              selectedBag={selectedBag}
              addDiscToBag={addDiscToBag}
              removeFromCollection={removeFromCollection}
            />
          </div>

          <div className="bag-side-panel">
            <BagManager
              newBagName={newBagName}
              setNewBagName={setNewBagName}
              createBag={createBag}
              deleteBag={deleteBag}
              bags={bags}
              selectedBagId={selectedBagId}
              setSelectedBagId={setSelectedBagId}
              selectedBag={selectedBag}
              selectedBagDiscs={selectedBagDiscs}
              removeDiscFromBag={removeDiscFromBag}
              updateDiscWear={updateDiscWear}
            />
          </div>
        </div>
      )}
    </div>
  );
}