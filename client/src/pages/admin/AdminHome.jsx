import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import AdminNav from "../../components/AdminNav.jsx";

export default function AdminHome() {
  const [pending, setPending] = useState(null);
  const [users, setUsers] = useState(null);
  const [reports, setReports] = useState(null);

  useEffect(() => {
    api.get("/admin/helpers?status=pending").then(({ data }) => setPending(data.length));
    api.get("/admin/users").then(({ data }) => setUsers(data.length));
    api.get("/admin/reports").then(({ data }) => setReports(data.length));
  }, []);

  return (
    <div className="container py-5">
      <h1 className="h2 mb-4">Admin</h1>
      <AdminNav />

      <div className="row g-3" style={{ maxWidth: "60rem" }}>
        <div className="col-sm-4">
          <Link to="/admin/helpers" className="cc-panel d-block text-decoration-none">
            <div className="fs-2 fw-bold">{pending ?? "–"}</div>
            <div className="text-secondary">Helper applications waiting</div>
          </Link>
        </div>
        <div className="col-sm-4">
          <Link to="/admin/reports" className="cc-panel d-block text-decoration-none">
            <div className="fs-2 fw-bold">{reports ?? "–"}</div>
            <div className="text-secondary">Open reports</div>
          </Link>
        </div>
        <div className="col-sm-4">
          <Link to="/admin/users" className="cc-panel d-block text-decoration-none">
            <div className="fs-2 fw-bold">{users ?? "–"}</div>
            <div className="text-secondary">Registered users</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
