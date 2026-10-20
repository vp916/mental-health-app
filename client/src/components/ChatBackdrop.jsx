// Pictures floating behind a chat window. The pictures live in client/public/images/chat.
// Each item: which picture, how big (px), where it sits around the window, and a small tilt.
export const aiFaces = [
  { image: "happy", size: 150, top: -30, left: -110, rotate: -8 },
  { image: "okay", size: 115, top: 70, left: -170, rotate: 6 },
  { image: "neutral", size: 95, bottom: 110, left: -120, rotate: 12 },
  { image: "low", size: 70, bottom: 30, left: -60, rotate: -10 },
  { image: "calm", size: 130, top: 90, right: -100, rotate: 8 },
  { image: "smile", size: 80, bottom: 60, right: -60, rotate: -6 },
];

export const helperShapes = [
  { image: "leaf", size: 150, top: -40, left: -95, rotate: -28 },
  { image: "pebble-sand", size: 120, top: 90, left: -165, rotate: 10 },
  { image: "pebble-lilac", size: 90, bottom: 90, left: -120, rotate: -15 },
  { image: "leaf-light", size: 110, top: 70, right: -90, rotate: 32 },
  { image: "pebble-blush", size: 85, bottom: 50, right: -70, rotate: 20 },
];

// Only shown on wide screens, where there is room around the window.
export default function ChatBackdrop({ items }) {
  return (
    <div className="cc-faces d-none d-xl-block" aria-hidden="true">
      {items.map(({ image, size, rotate, ...place }, i) => (
        <img key={i} src={`/images/chat/${image}.svg`} alt="" width={size} height={size}
          style={{ ...place, "--rotate": `${rotate}deg`, animationDelay: `${i * -1.5}s` }} />
      ))}
    </div>
  );
}
