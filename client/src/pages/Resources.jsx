import { useEffect, useState } from "react";
import api, { errorMessage } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useOptions } from "../context/OptionsContext.jsx";

export default function Resources() {
  const { user } = useAuth();
  const options = useOptions();
  const categories = options ? options.resourceCategories : [];
  const [category, setCategory] = useState("");     // "" = all categories
  const [showSaved, setShowSaved] = useState(false);
  const [resources, setResources] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSaved() {
      try {
        const { data } = await api.get("/bookmarks");
        setSavedIds(data.map((r) => r.id));
      } catch (err) {
        setError(errorMessage(err));
      }
    }
    if (user) loadSaved();
  }, [user]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/resources", { params: { category } });
        setResources(data);
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  async function toggleSaved(id) {
    try {
      if (savedIds.includes(id)) {
        await api.delete(`/bookmarks/${id}`);
        setSavedIds(savedIds.filter((x) => x !== id));
      } else {
        await api.post(`/bookmarks/${id}`);
        setSavedIds([...savedIds, id]);
      }
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  function chooseCategory(c) {
    setCategory(c);
    setShowSaved(false);
  }

  function chooseSaved() {
    setCategory("");
    setShowSaved(true);
  }

  let shown = resources;
  if (showSaved) shown = resources.filter((r) => savedIds.includes(r.id));

  return (
    <div className="container py-5">
      <PageHeader title="Resources" text="Reading, videos and exercises for stress, sleep and student life. Save the ones that help." />

      <div className="d-flex flex-wrap gap-2 mb-4">
        <button className={`btn btn-sm ${!showSaved && category === "" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => chooseCategory("")}>
          All
        </button>
        {user && (
          <button className={`btn btn-sm ${showSaved ? "btn-primary" : "btn-outline-primary"}`} onClick={chooseSaved}>
            Saved
          </button>
        )}
        {categories.map((c) => (
          <button key={c} className={`btn btn-sm ${!showSaved && c === category ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => chooseCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading && <p className="text-secondary">Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && shown.length === 0 && (
        <p className="text-secondary">{showSaved ? "You haven't saved anything yet." : "Nothing in this category yet."}</p>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        {shown.map((r) => (
          <div className="col" key={r.id}>
            <article className="cc-panel h-100">
              <div className="d-flex justify-content-between gap-2 mb-1">
                <div className="small text-secondary text-capitalize">{r.type} · {r.category}</div>
                {user && (
                  <button className="btn btn-link btn-sm p-0" onClick={() => toggleSaved(r.id)}>
                    {savedIds.includes(r.id) ? "Saved" : "Save"}
                  </button>
                )}
              </div>
              <h2 className="h5 mb-2">
                {r.url ? <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a> : r.title}
              </h2>
              {r.body && <p className="mb-0">{r.body}</p>}
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
