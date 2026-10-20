export const ink = "#2f2a3a";

// Eye and mouth shapes, drawn on a 40 x 40 face.
export const eyes = {
  dot: <><circle cx="14" cy="17" r="1.7" fill={ink} /><circle cx="26" cy="17" r="1.7" fill={ink} /></>,
  closed: <path d="M11 17 q3 -3 6 0 M23 17 q3 -3 6 0" />,
};
export const mouths = {
  smile: "M12 24 Q20 31 28 24",
  soft: "M14 25 Q21 29 27 23",
  flat: "M15 26 L25 26",
  low: "M14 28 Q20 23 26 28",
};

export default function MoodFace({ color = "#a9dcb6", eye = "dot", mouth = "smile", size = 32, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="flex-shrink-0" style={style}>
      <circle cx="20" cy="20" r="19" fill={color} />
      <g fill="none" stroke={ink} strokeWidth={size > 60 ? 1.1 : 1.6} strokeLinecap="round">
        {eyes[eye]}
        <path d={mouths[mouth]} />
      </g>
    </svg>
  );
}

const backdrop = [
  { color: "#f6dc6b", eye: "closed", mouth: "smile", size: 150, top: -30, left: -110, rotate: -8 },
  { color: "#8fcfc0", eye: "dot", mouth: "soft", size: 115, top: 70, left: -170, rotate: 6 },
  { color: "#f2b3c9", eye: "dot", mouth: "flat", size: 95, bottom: 110, left: -120, rotate: 12 },
  { color: "#f4a48f", eye: "dot", mouth: "low", size: 70, bottom: 30, left: -60, rotate: -10 },
  { color: "#a9d8a3", eye: "closed", mouth: "soft", size: 130, top: 90, right: -100, rotate: 8 },
  { color: "#9cc8ec", eye: "dot", mouth: "smile", size: 80, bottom: 60, right: -60, rotate: -6 },
];

// Soft faces floating behind the chat window, only on wide screens.
export function FaceBackdrop() {
  return (
    <div className="cc-faces d-none d-xl-block" aria-hidden="true">
      {backdrop.map(({ color, eye, mouth, size, rotate, ...place }, i) => (
        <MoodFace key={i} color={color} eye={eye} mouth={mouth} size={size}
          style={{ ...place, "--rotate": `${rotate}deg`, animationDelay: `${i * -1.5}s` }} />
      ))}
    </div>
  );
}

export const leaf = "M20 3 C31 11 32 27 20 37 C8 27 9 11 20 3 Z";
export const pebble = "M8 22 C6 12 16 5 25 7 C34 9 37 19 33 27 C29 35 16 36 11 31 C9 29 8.5 25 8 22 Z";

const nature = [
  { shape: leaf, color: "#b7cdb0", size: 150, top: -40, left: -95, rotate: -28 },
  { shape: pebble, color: "#e9dcc3", size: 120, top: 90, left: -165, rotate: 10 },
  { shape: pebble, color: "#d9cdf3", size: 90, bottom: 90, left: -120, rotate: -15 },
  { shape: leaf, color: "#c9dccf", size: 110, top: 70, right: -90, rotate: 32 },
  { shape: pebble, color: "#f0d2c8", size: 85, bottom: 50, right: -70, rotate: 20 },
];

// Leaves and pebbles behind the helper chat, only on wide screens.
export function NatureBackdrop() {
  return (
    <div className="cc-faces d-none d-xl-block" aria-hidden="true">
      {nature.map(({ shape, color, size, rotate, ...place }, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 40 40"
          style={{ ...place, "--rotate": `${rotate}deg`, animationDelay: `${i * -1.5}s` }}>
          <path d={shape} fill={color} />
          {shape === leaf && <path d="M20 7 L20 34" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.6" />}
        </svg>
      ))}
    </div>
  );
}
