// src/app/theme/ThemeProvider.tsx
import { createContext, useMemo, useState, type ReactNode } from "react";
import {
  ThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

declare module "@mui/material/styles" {
  interface Palette {
    myColors: Palette["primary"];
    icon: {
      main: string;
      background: string;
    };
  }
  interface PaletteOptions {
    myColors?: PaletteOptions["primary"];
    icon?: {
      main: string;
      background: string;
    };
  }
}

export const ColorModeContext = createContext<{
  mode: PaletteMode;
  toggleColorMode: () => void;
}>({
  mode: "light",
  toggleColorMode: () => {},
});

type AppThemeProviderProps = {
  children: ReactNode;
};

const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window === "undefined") return "light";

    const stored = localStorage.getItem("mode") as PaletteMode | null;

    if (stored === "light" || stored === "dark") return stored;

    return prefersDarkMode ? "dark" : "light";
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next: PaletteMode = prev === "light" ? "dark" : "light";
          if (typeof window !== "undefined") {
            localStorage.setItem("mode", next);
          }
          return next;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#272786ff",
          },

          // ÖZEL RENK GRUBUN (buton vs. için kullanabilirsin)
          icon:
            mode === "light"
              ? {
                  main: "#232F46", // açık gri (örn. icon/light)
                  background: "#F0F2F5", // koyu ton
                }
              : {
                  main: "#DFE6F2", // koyu ana renk
                  background: "#1A1A1A", // daha koyu
                },
          ...(mode === "dark"
            ? {
                background: {
                  default: "#262626",
                  paper: "rgba(223, 230, 242, 0.08)",
                },
              }
            : {
                background: {
                  default: "#ffffff",
                  paper: "#ffffff",
                },
              }),
        },
        typography: {
          allVariants: {
            color: mode === "light" ? "#232F46" : "#DFE6F2",
          },
          fontFamily:
            '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: { fontSize: "2.5rem", fontWeight: 700 },
          h2: { fontSize: "2rem", fontWeight: 600 },
          h3: { fontSize: "1.5rem", fontWeight: 600 },
          button: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 999, // pill style
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider
      value={{ mode, toggleColorMode: colorMode.toggleColorMode }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AppThemeProvider;
