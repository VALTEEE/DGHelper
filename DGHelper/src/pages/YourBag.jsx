import { useEffect, useState } from "react";
import DiscSearch from "../components/DiscSearch";
import DiscCollection from "../components/DiscCollection";
import BagManager from "../components/BagManager";

export default function YourBag() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [ownedDiscs, setOwnedDiscs] = useState([]);
  const [bags, setBags] = useState([]);
  const [newBagName, setNewBagName] = useState("");
  const [selectedBagId, setSelectedBagId] = useState(null);

  // Load collection + bags from localStorage
  useEffect(() => {
    const savedOwnedDiscs = localStorage.getItem("ownedDiscs");
    const savedBags = localStorage.getItem("bags");

    if (savedOwnedDiscs) {
      setOwnedDiscs(JSON.parse(savedOwnedDiscs));
    }

    if (savedBags) {
      const parsedBags = JSON.parse(savedBags);
      setBags(parsedBags);

      if (parsedBags.length > 0) {
        setSelectedBagId(parsedBags[0].id);
      }
    }
  }, []);

  // Save collection to localStorage
  useEffect(() => {
    localStorage.setItem("ownedDiscs", JSON.stringify(ownedDiscs));
  }, [ownedDiscs]);

  // Save bags to localStorage
  useEffect(() => {
    localStorage.setItem("bags", JSON.stringify(bags));
  }, [bags]);

  // Search discs from backend when typing
  useEffect(() => {
    async function fetchSearchResults() {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/discs?limit=200");
        const data = await res.json();

        const filtered = (data.data || []).filter(disc =>
          `${disc.brand} ${disc.name}`.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(filtered.slice(0, 10)); // only show top 10
      } catch (error) {
        console.error("Failed to search discs:", error);
      }
    }

    fetchSearchResults();
  }, [searchTerm]);

  // Add disc to owned collection
  function addToCollection(disc) {
    const alreadyOwned = ownedDiscs.some(d => d.id === disc.id);
    if (alreadyOwned) return;

    setOwnedDiscs([...ownedDiscs, disc]);
    setSearchTerm("");
    setSearchResults([]);
  }

  // Remove disc from owned collection
  function removeFromCollection(discId) {
    setOwnedDiscs(ownedDiscs.filter(d => d.id !== discId));

    setBags(
      bags.map(bag => ({
        ...bag,
        discIds: bag.discIds.filter(id => id !== discId)
      }))
    );
  }

  // Create new bag
  function createBag() {
    if (!newBagName.trim()) return;

    const newBag = {
      id: Date.now(),
      name: newBagName,
      discIds: []
    };

    const updatedBags = [...bags, newBag];
    setBags(updatedBags);
    setSelectedBagId(newBag.id);
    setNewBagName("");
  }

  // Add disc to selected bag
  function addDiscToBag(discId) {
    setBags(
      bags.map(bag =>
        bag.id === selectedBagId && !bag.discIds.includes(discId)
          ? { ...bag, discIds: [...bag.discIds, discId] }
          : bag
      )
    );
  }

  // Remove disc from bag
  function removeDiscFromBag(discId) {
    setBags(
      bags.map(bag =>
        bag.id === selectedBagId
          ? { ...bag, discIds: bag.discIds.filter(id => id !== discId) }
          : bag
      )
    );
  }

  const selectedBag = bags.find(bag => bag.id === selectedBagId);

  const selectedBagDiscs = selectedBag
    ? ownedDiscs.filter(disc => selectedBag.discIds.includes(disc.id))
    : [];

  return (
    <div className="your-bag-page">
      <h1>Your Bag</h1>

      <DiscSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchResults={searchResults}
        addToCollection={addToCollection}
      />

      <DiscCollection
        ownedDiscs={ownedDiscs}
        selectedBag={selectedBag}
        addDiscToBag={addDiscToBag}
        removeFromCollection={removeFromCollection}
      />

      <BagManager
        newBagName={newBagName}
        setNewBagName={setNewBagName}
        createBag={createBag}
        bags={bags}
        selectedBagId={selectedBagId}
        setSelectedBagId={setSelectedBagId}
        selectedBag={selectedBag}
        selectedBagDiscs={selectedBagDiscs}
        removeDiscFromBag={removeDiscFromBag}
      />
    </div>
  );
}