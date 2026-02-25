import { createRoot } from "react-dom/client";
import { Component, type ErrorInfo, type ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[App crash]", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ fontFamily: "Inter, sans-serif", padding: "48px 24px", maxWidth: 520, margin: "0 auto" }}>
          <h2 style={{ color: "#F0531C", fontSize: 20, marginBottom: 12 }}>Something went wrong</h2>
          <pre style={{ background: "#f0ebe1", borderLeft: "3px solid #F0531C", padding: "12px 16px", borderRadius: 6, fontSize: 13, whiteSpace: "pre-wrap", color: "#09332C" }}>
            {(this.state.error as Error).message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
