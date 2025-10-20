import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/accessibility.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AccessibilityProvider } from "./contexts/AccessibilityContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AccessibilityProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </AccessibilityProvider>
    </ThemeProvider>
  </StrictMode>,
);
