// The soft heading band at the top of each page. children = buttons shown on the right.
export default function PageHeader({ title, text, children }) {
  return (
    <header className="cc-page-head">
      <div>
        <h1>{title}</h1>
        {text && <p className="mb-0">{text}</p>}
      </div>
      {children}
    </header>
  );
}
