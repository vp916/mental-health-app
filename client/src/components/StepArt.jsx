import { ink, eyes, mouths, leaf, pebble } from "./ChatBackdrop.jsx";

// Places a 40 x 40 drawing at (x, y), centred, at the given size.
function Place({ x, y, size, rotate = 0, children }) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${size / 40}) translate(-20 -20)`}>{children}</g>;
}

function Face({ color, eye = "dot", mouth = "smile", ...place }) {
  return (
    <Place {...place}>
      <circle cx="20" cy="20" r="19" fill={color} />
      <g fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round">
        {eyes[eye]}
        <path d={mouths[mouth]} />
      </g>
    </Place>
  );
}

function Shape({ d, color, ...place }) {
  return <Place {...place}><path d={d} fill={color} /></Place>;
}

// Small drawings for the home page. Each one is a 300 x 200 picture (cluster is 300 x 160).
const arts = {
  penName: (
    <>
      <rect width="300" height="200" fill="#ede7fc" />
      <Shape d={leaf} color="#b7cdb0" x={62} y={62} size={110} rotate={-30} />
      <Shape d={pebble} color="#e9dcc3" x={238} y={156} size={120} />
      <Face color="#f6dc6b" eye="closed" mouth="soft" x={150} y={104} size={112} />
      <Shape d={leaf} color="#a3bf9b" x={98} y={150} size={84} rotate={42} />
      <rect x="168" y="26" width="116" height="32" rx="16" fill="#fff" />
      <text x="226" y="47" textAnchor="middle" fontSize="13" fill="#5a3db3">Quiet Otter 42</text>
    </>
  ),
  checkIn: (
    <>
      <rect width="300" height="200" fill="#fbf2c4" />
      <Shape d={leaf} color="#c9dccf" x={40} y={42} size={56} rotate={-20} />
      <Shape d={pebble} color="#d9cdf3" x={268} y={172} size={64} />
      <Face color="#f19a8e" mouth="low" x={45} y={124} size={44} />
      <Face color="#f6bd8a" mouth="flat" x={96} y={110} size={44} />
      <Face color="#f3d97c" mouth="flat" x={150} y={104} size={44} />
      <circle cx="204" cy="110" r="34" fill="#fff" opacity="0.7" />
      <Face color="#a9dcb6" mouth="soft" x={204} y={110} size={58} />
      <Face color="#86cfa5" eye="closed" mouth="smile" x={258} y={124} size={44} />
    </>
  ),
  talk: (
    <>
      <rect width="300" height="200" fill="#e4ecfb" />
      <Shape d={leaf} color="#b7cdb0" x={272} y={34} size={54} rotate={30} />
      <Face color="#8fcfc0" mouth="soft" x={72} y={136} size={92} rotate={6} />
      <Face color="#f2b3c9" eye="closed" mouth="smile" x={234} y={140} size={80} rotate={-6} />
      <rect x="96" y="28" width="92" height="40" rx="20" fill="#fff" />
      <circle cx="126" cy="48" r="4" fill="#9a93a8" />
      <circle cx="142" cy="48" r="4" fill="#9a93a8" />
      <circle cx="158" cy="48" r="4" fill="#9a93a8" />
      <rect x="138" y="80" width="84" height="36" rx="18" fill="#cbb8f6" />
      <rect x="154" y="92" width="52" height="5" rx="2.5" fill="#fff" />
      <rect x="154" y="102" width="34" height="5" rx="2.5" fill="#fff" />
    </>
  ),
  cluster: (
    <>
      <rect width="300" height="160" fill="#ede7fc" />
      <g style={{ mixBlendMode: "multiply" }}>
        <Face color="#9cc8ec" x={62} y={104} size={64} />
        <Face color="#f6dc6b" eye="closed" mouth="smile" x={118} y={74} size={118} />
        <Face color="#8fcfc0" mouth="soft" x={188} y={98} size={100} />
        <Face color="#f2b3c9" mouth="flat" x={244} y={56} size={70} />
      </g>
    </>
  ),
};

export default function StepArt({ name, className }) {
  const height = name === "cluster" ? 160 : 200;
  return (
    <svg viewBox={`0 0 300 ${height}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {arts[name]}
    </svg>
  );
}
