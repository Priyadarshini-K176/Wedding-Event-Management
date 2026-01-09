export default function AgendaCard({ time, title, location }) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
      }}
    >
      <h3>{time} — {title}</h3>
      <p>{location}</p>
    </div>
  );
}
