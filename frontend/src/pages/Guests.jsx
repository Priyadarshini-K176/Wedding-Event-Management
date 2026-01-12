import { useState } from "react";
import { guests as mockGuests } from "../data/guest.mock";

import GuestSummary from "../components/guests/GuestSummary";
import GuestFilters from "../components/guests/GuestFilters";
import GuestTable from "../components/guests/GuestTable";
import "../styles/guests.css";
import AddGuestModal from "../components/guests/AddGuestModal";
import { fetchGuestsApi, addGuestApi } from "../services/guest.api";
import { useEffect } from "react";

const Guests = () => {
  const [guests, setGuests] = useState(mockGuests);
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [side, setSide] = useState("ALL");

  useEffect(() => {
  fetchGuestsApi().then(res => setGuests(res.data.data));
}, []);



 const addGuest = async (guest) => {
  const res = await addGuestApi(guest);
  setGuests(prev => [...prev, res.data.data]);
};


  return (
    <div className="guest-page">
      <h1>Guest List</h1>

      <GuestSummary guests={guests} />


      <GuestFilters
        filter={filter}
        setFilter={setFilter}
        side={side}
        setSide={setSide}
      />

      <GuestTable
        guests={guests}
        filter={filter}
        side={side}
        setGuests={setGuests}
      />

      <button
        className="add-guest-btn"
        onClick={() => setShowModal(true)}
      >
        + Add Guest
      </button>

      {showModal && (
        <AddGuestModal
          onClose={() => setShowModal(false)}
          onAdd={addGuest}
        />
      )}
    </div>
  );
};

export default Guests;
