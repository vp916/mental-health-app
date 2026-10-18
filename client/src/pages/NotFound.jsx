import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-5">
      <h1 className="h2 mb-3">Page not found</h1>
      <p className="text-secondary">
        This address doesn't match any page. <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
