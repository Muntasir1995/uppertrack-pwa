import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// A crash anywhere in the app previously meant a blank white screen with no
// way to recover short of guessing what happened. This catches any render
// error and shows a plain "something went wrong, reload" message instead -
// a safety net, not a fix for any specific bug, so the app degrades
// gracefully instead of disappearing.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "", stack: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || String(error) };
  }
  componentDidCatch(error, info) {
    console.error("UpperTrack crashed:", error, info);
    this.setState({ stack: (info && info.componentStack) || "" });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "system-ui, sans-serif", background: "#F5F7F8" }}>
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#101E2B", marginBottom: 8 }}>Something went wrong</div>
            <div style={{ fontSize: 14, color: "#4B5C68", marginBottom: 16 }}>
              This usually clears up with a reload. If you were in the middle of a note, your entries for this session may need to be re-entered.
            </div>
            {this.state.message && (
              <div style={{ fontSize: 12, color: "#B91C1C", background: "#FCEAEA", border: "1px solid #B91C1C", borderRadius: 8, padding: 12, marginBottom: 16, textAlign: "left", fontFamily: "ui-monospace, monospace", wordBreak: "break-word" }}>
                {this.state.message}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{ background: "#0A5D65", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontWeight: 600, fontSize: 14 }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// vite-plugin-pwa's "autoUpdate" mode installs a new service worker in the
// background as soon as one is available, but by default an already-open
// tab keeps running on its old JavaScript until the page is reloaded. If a
// new deploy has replaced the files the old JS depends on in the meantime,
// any fetch for those old files fails - which is the most likely cause of
// the crash. Reloading once, automatically, the moment a new service
// worker takes over keeps everything in sync and avoids that mismatch
// entirely, rather than leaving it to chance.
if ("serviceWorker" in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
