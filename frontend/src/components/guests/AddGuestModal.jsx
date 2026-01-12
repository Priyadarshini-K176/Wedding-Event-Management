const AddGuestModal = ({ onClose, onAdd }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const newGuest = {
      id: Date.now(),
      name: form.name.value,
      phone: form.phone.value,
      side: form.side.value,
      events: [form.event.value],
      rsvp: "PENDING",
    };

    onAdd(newGuest);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Guest</h2>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Guest Name" required />
          <input name="phone" placeholder="Phone Number" required />

          <select name="side">
            <option value="BRIDE">Bride Side</option>
            <option value="GROOM">Groom Side</option>
          </select>

          <select name="event">
            <option value="Reception">Reception</option>
            <option value="Wedding">Wedding</option>
            <option value="Mehndi">Mehndi</option>
          </select>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGuestModal;
