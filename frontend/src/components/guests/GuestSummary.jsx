const GuestSummary = ({ guests }) => {
  const total = guests.length;
  const accepted = guests.filter(g => g.rsvp === "ACCEPTED").length;
  const pending = guests.filter(g => g.rsvp === "PENDING").length;
  const declined = guests.filter(g => g.rsvp === "DECLINED").length;

  return (
    <div className="guest-summary">
      <div>Total: {total}</div>
      <div>Accepted: {accepted}</div>
      <div>Pending: {pending}</div>
      <div>Declined: {declined}</div>
    </div>
  );
};

export default GuestSummary;
