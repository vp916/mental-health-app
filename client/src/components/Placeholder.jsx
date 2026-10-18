// Temporary stand-in for pages that aren't built yet.
// Delete it from a page once you start building that page.
export default function Placeholder({ title, owner, todo = [] }) {
  return (
    <div className="container py-5">
      <h1 className="h2">{title}</h1>
      <div className="cc-placeholder mt-4">
        <p className="mb-2">
          Not built yet. Owner: <strong>{owner}</strong>
        </p>
        {todo.length > 0 && (
          <ul className="mb-0">
            {todo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
