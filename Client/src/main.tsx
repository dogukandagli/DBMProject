import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "./app/store/store.ts";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./shared/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
