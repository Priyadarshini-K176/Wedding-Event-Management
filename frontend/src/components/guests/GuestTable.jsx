import { updateGuestRsvpApi } from "../../services/guest.api";

const GuestTable = ({ guests = [], filter, side, setGuests }) => {

  // Apply filters safely
  const filteredGuests = guests.filter(g => {
    if (filter !== "ALL" && g.rsvp !== filter) return false;
    if (side !== "ALL" && g.side !== side) return false;
    return true;
  });

  // Update RSVP (frontend + backend)
  const updateRsvp = async (id, newStatus) => {
    // 1. Find the guest and their current status BEFORE updating
    const currentGuest = guests.find(g => g._id === id);
    if (!currentGuest) return;
    
    const previousStatus = currentGuest.rsvp;

    // 2. Optimistic update: Change UI immediately
    setGuests(prev =>
      prev.map(g =>
        g._id === id ? { ...g, rsvp: newStatus } : g
      )
    );

    try {
      // 3. Backend call
      await updateGuestRsvpApi(id, newStatus);
    } catch (err) {
      console.error("Failed to update RSVP:", err);

      // 4. Rollback to PREVIOUS value only if API fails
      setGuests(prev =>
        prev.map(g =>
          g._id === id ? { ...g, rsvp: previousStatus } : g
        )
      );
    }
  };

  return (
    <div className="guest-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Side</th>
            <th>Events</th>
            <th>RSVP</th>
          </tr>
        </thead>

        <tbody>
          {filteredGuests.length === 0 ? (
            <tr key="no-data">
              <td colSpan="5" style={{ textAlign: "center", padding: "24px" }}>
                No guests found
              </td>
            </tr>
          ) : (
            filteredGuests.map((guest) => (
              <tr key={guest._id}>
                <td>{guest.name}</td>
                <td>{guest.phone}</td>
                <td>{guest.side}</td>
                <td>{guest.events.join(", ")}</td>
                <td>
                  <select
                    value={guest.rsvp}
                    onChange={(e) => updateRsvp(guest._id, e.target.value)}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="DECLINED">Declined</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GuestTable;