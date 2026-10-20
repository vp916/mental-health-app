import { Link, Navigate } from "react-router-dom";
import { useAuth, homePath } from "../context/AuthContext.jsx";
import BreathingCircle from "../components/BreathingCircle.jsx";

const steps = [
  { title: "Get a pen name", image: "/images/step-pen-name.svg", text: "We give you a random name like Quiet Otter 42. Nobody in the community sees who you really are." },
  { title: "Notice how you're doing", image: "/images/step-check-in.svg", text: "Log your mood, write in a private journal and take short check-ins for stress and anxiety." },
  { title: "Talk when you're ready", image: "/images/step-talk.svg", text: "Message a verified therapist or trained listener. Only the two of you can read the chat." },
];

const features = [
  { title: "Log how today felt", text: "Rate your mood, stress and sleep in under a minute. See how the week went." },
  { title: "Write it down", text: "A private journal only you can read. Tag entries by feeling and search them later." },
  { title: "Check in on stress and anxiety", text: "Short, well-known questionnaires that show where you are right now." },
  { title: "Talk to people who get it", text: "Share and reply under a pen name. Others can only answer with replies and supportive reactions." },
];

export default function Home() {
  const { user } = useAuth();
  if (user) return <Navigate to={homePath(user)} replace />;

  return (
    <>
      <section className="cc-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="cc-badge mb-4">Verified helpers, no real names</span>
              <h1 className="mb-4">
                <span className="cc-rise">A quiet place</span>
                <span className="cc-rise" style={{ "--delay": "0.15s" }}>for heavy days.</span>
              </h1>
              <p className="lead mb-4">
                Track your mood, keep a private journal and find support when college gets heavy.
                The orb in the cube breathes with you. Follow it for a minute.
              </p>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link to="/register" className="btn btn-primary btn-lg">Create an account</Link>
                <Link to="/login" className="cc-text-link">I already have an account</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <BreathingCircle />
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="cc-night">
          <div className="cc-night-head">
            <div>
              <h2 className="mb-2">How CalmConnect works</h2>
              <p className="cc-night-lead mb-0">Three steps. You never have to use your real name.</p>
            </div>
            <img className="cc-night-art d-none d-md-block" src="/images/faces-cluster.svg" alt="" />
          </div>
          <div className="row g-4">
            {steps.map((s, i) => (
              <div className="col-md-4" key={s.title}>
                <div className="cc-tab-card h-100" data-step={`/0${i + 1}`}>
                  <img className="cc-tab-art" src={s.image} alt="" />
                  <h3 className="h4 mb-2">{s.title}</h3>
                  <p className="mb-0">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cc-features">
        <div className="container">
          <h2 className="mb-4">What's inside</h2>
          {features.map((f) => (
            <div className="cc-feature row g-2" key={f.title}>
              <h3 className="col-md-5 mb-0">{f.title}</h3>
              <p className="col-md-7 mb-0">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-4">
        <div className="cc-join d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h2 className="h4 mb-1">Are you a therapist or a trained listener?</h2>
            <p className="mb-0">Join as a helper. We verify every helper before they can talk to anyone.</p>
          </div>
          <Link to="/register" className="btn btn-primary">Join as a helper</Link>
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
