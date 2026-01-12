const GuestTable = ({ guests, filter, setGuests ,side }) => {
  let filteredGuests = guests;

if (filter !== "ALL") {
  filteredGuests = filteredGuests.filter(g => g.rsvp === filter);
}

if (side !== "ALL") {
  filteredGuests = filteredGuests.filter(g => g.side === side);
}


  const updateRsvp = (id, newStatus) => {
    setGuests(prev =>
      prev.map(g =>
        g.id === id ? { ...g, rsvp: newStatus } : g
      )
    );
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
        {filteredGuests.map(guest => (
          <tr key={guest.id}>
            <td>{guest.name}</td>
            <td>{guest.phone}</td>
            <td>{guest.side}</td>
            <td>{guest.events.join(", ")}</td>
            <td>
              <select
                value={guest.rsvp}
                onChange={(e) => updateRsvp(guest.id, e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="DECLINED">Declined</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default GuestTable;
