import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "@/hooks/useAuth";

// Determine if mock auth should be used
const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider useMockAuth={useMockAuth}>
      <App />
    </AuthProvider>
  </StrictMode>,
);
