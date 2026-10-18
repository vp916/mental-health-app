import { useEffect, useState } from "react";
import api, { errorMessage } from "../api/axios.js";

export default function Resources() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/options").then(({ data }) => setCategories(data.resourceCategories));
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/resources", { params: category ? { category } : {} });
        setResources(data);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  return (
    <div className="container py-5">
      <h1 className="h2 mb-4">Resources</h1>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {["", ...categories].map((c) => (
          <button
            key={c || "all"}
            className={`btn btn-sm ${c === category ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setCategory(c)}
          >
            {c || "All"}
          </button>
        ))}
      </div>

      {loading && <p className="text-secondary">Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && resources.length === 0 && (
        <p className="text-secondary">Nothing in this category yet.</p>
      )}

      <div className="d-grid gap-3" style={{ maxWidth: "46rem" }}>
        {resources.map((r) => (
          <article className="cc-panel" key={r.id}>
            <div className="small text-secondary mb-1 text-capitalize">
              {r.type} · {r.category}
            </div>
            <h2 className="h5 mb-2">
              {r.url ? (
                <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
              ) : (
                r.title
              )}
            </h2>
            {r.body && <p className="mb-0">{r.body}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
