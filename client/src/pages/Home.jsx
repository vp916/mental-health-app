import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import BreathingCircle from "../components/BreathingCircle.jsx";

const features = [
  { title: "Log how today felt", text: "Rate your mood, stress and sleep in under a minute. See how the week went." },
  { title: "Write it down", text: "A private journal only you can read. Tag entries by feeling and search them later." },
  { title: "Check in on stress and anxiety", text: "Short, well-known questionnaires that show where you are right now." },
  { title: "Talk to people who get it", text: "Share and reply in the community, with your name or anonymously." },
];

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <section className="cc-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 className="mb-3">Take a minute for yourself.</h1>
              <p className="lead mb-4">
                CalmConnect helps you track your mood, keep a private journal and find support when college
                gets heavy. Try the breathing circle while you're here.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Create an account
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  Log in
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <BreathingCircle />
            </div>
          </div>
        </div>
      </section>

      <section className="cc-features">
        <div className="container">
          <div className="row g-4">
            {features.map((f) => (
              <div className="col-md-6" key={f.title}>
                <h2 className="mb-2">{f.title}</h2>
                <p className="mb-0">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <div className="cc-helpline">
          <strong>Having a hard time right now?</strong> Tele-MANAS is free and open all day:{" "}
          call <strong>14416</strong>. <Link to="/help">More places to get help</Link>
        </div>
      </section>
    </>
  );
}
