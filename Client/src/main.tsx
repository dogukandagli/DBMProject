import { createRoot } from "react-dom/client";
import { store } from "./app/store/store.ts";
import App from "./App.tsx";
import { Provider } from "react-redux";
import AppThemeProvider from "./app/theme/ThemeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <AppThemeProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </AppThemeProvider>
);
