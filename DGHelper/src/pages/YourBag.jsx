import allDiscsData from "../data/discs";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DiscSearch from "../components/DiscSearch";
import DiscCollection from "../components/DiscCollection";
import BagManager from "../components/BagManager";
import { useAuth } from "../context/AuthContext";
import { fetchBag, saveBag } from "../utils/api";

export default function YourBag() {
  const { isAuthenticated } = useAuth();

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
    hasLoadedRef.current = false;

    async function loadBag() {
      setBagLoading(true);
      setSyncStatus("");

      try {
        if (isAuthenticated) {
          const data = await fetchBag();
          let nextOwned = data.ownedDiscs || [];
          let nextBags = data.bags || [];

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
        } else {
          const savedOwnedDiscs = localStorage.getItem("ownedDiscs");
          const savedBags = localStorage.getItem("bags");

          setOwnedDiscs(savedOwnedDiscs ? JSON.parse(savedOwnedDiscs) : []);

          if (savedBags) {
            const parsedBags = JSON.parse(savedBags);
            setBags(parsedBags);
            if (parsedBags.length > 0) setSelectedBagId(parsedBags[0].id);
          } else {
            setBags([]);
            setSelectedBagId(null);
          }
        }
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

    if (isAuthenticated) {
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
    }

    localStorage.setItem("ownedDiscs", JSON.stringify(ownedDiscs));
    localStorage.setItem("bags", JSON.stringify(bags));
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

  // Adds disc to collection and, if a bag is selected, directly to that bag too
  function handleAddFromSearch(disc) {
    if (!ownedDiscs.some((d) => d.id === disc.id)) {
      setOwnedDiscs((prev) => [...prev, disc]);
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

  const selectedBag = bags.find((bag) => bag.id === selectedBagId);
  const selectedBagDiscs = selectedBag
    ? ownedDiscs.filter((disc) => selectedBag.discIds.includes(disc.id))
    : [];

  return (
    <div className="your-bag-page">
      <div className="bag-page-header">
        <h1>Your Bag</h1>
        <div className="bag-page-meta">
          {!isAuthenticated && (
            <p className="bag-login-prompt">
              <Link to="/login">Log in</Link> to save your bag to your account.
            </p>
          )}
          {isAuthenticated && syncStatus && (
            <p className="bag-sync-status">{syncStatus}</p>
          )}
        </div>
      </div>

      {bagLoading ? (
        <div className="bag-loading">
          <p>Loading your bag...</p>
        </div>
      ) : (
        <div className="bag-workspace">
          {/* Left panel: search + collection */}
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

          {/* Right panel: the bag */}
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
            />
          </div>
        </div>
      )}
    </div>
  );
}
