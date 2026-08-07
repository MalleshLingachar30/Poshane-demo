export default function ParcelMap({
  polygon,
  height = 150,
}: {
  polygon: [number, number][];
  height?: number;
}) {
  const pts = polygon.map((p) => p.join(",")).join(" ");
  return (
    <svg
      viewBox="0 0 260 132"
      width="100%"
      height={height}
      role="img"
      aria-label="Parcel boundary"
      style={{ background: "var(--green-tint)", borderRadius: 8, display: "block" }}
    >
      <path
        d="M0 44H260 M0 92H260 M62 0V132 M148 0V132"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
      />
      <polygon
        points={pts}
        fill="#1c5a33"
        fillOpacity="0.2"
        stroke="#1c5a33"
        strokeWidth="1.8"
      />
    </svg>
  );
}
