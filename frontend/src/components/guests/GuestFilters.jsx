const GuestFilters = ({ filter, setFilter, side, setSide }) => {
  
  return (
    <div className="guest-filters">
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="ALL">All RSVP</option>
        <option value="ACCEPTED">Accepted</option>
        <option value="PENDING">Pending</option>
        <option value="DECLINED">Declined</option>
      </select>

      <select value={side} onChange={(e) => setSide(e.target.value)}>
        <option value="ALL">All Sides</option>
        <option value="BRIDE">Bride</option>
        <option value="GROOM">Groom</option>
      </select>
    </div>
  );
};

export default GuestFilters;
