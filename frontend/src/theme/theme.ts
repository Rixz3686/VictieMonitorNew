import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    customTokens: {
      gradients: {
        sidebar: string;
        logo: string;
        activeBar: string;
      };
      shadows: {
        accent: string;
        cardHover: string;
      };
      colors: {
        sidebarText: string;
        sidebarActive: string;
        sidebarHover: string;
        borderLight: string;
      };
    };
  }
  interface ThemeOptions {
    customTokens?: {
      gradients?: {
        sidebar?: string;
        logo?: string;
        activeBar?: string;
      };
      shadows?: {
        accent?: string;
        cardHover?: string;
      };
      colors?: {
        sidebarText?: string;
        sidebarActive?: string;
        sidebarHover?: string;
        borderLight?: string;
      };
    };
  }
}

const theme = createTheme({
  customTokens: {
    gradients: {
      sidebar: "linear-gradient(180deg, #3D1829 0%, #2A1220 30%, #1E0D17 70%, #1A0A13 100%)",
      logo: "linear-gradient(135deg, #dd7b8d, #c5697a)",
      activeBar: "linear-gradient(180deg, #dd7b8d, #e9a3b0)",
    },
    shadows: {
      accent: "0 4px 14px rgba(221, 123, 141, 0.25)",
      cardHover: "0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)",
    },
    colors: {
      sidebarText: "rgba(255, 255, 255, 0.85)",
      sidebarActive: "rgba(221, 123, 141, 0.18)",
      sidebarHover: "rgba(255,255,255,0.05)",
      borderLight: "#F1F5F9",
    }
  },
  palette: {
    primary: {
      main: "#dd7b8d",
    },
    secondary: {
      main: "#dd7b8d",
    },
    error: {
      main: "#DC2626",
    },
    success: {
      main: "#16A34A",
    },
    warning: {
      main: "#D97706",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontFamily: "'Oswald', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Oswald', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Oswald', sans-serif", fontWeight: 600 },
    button: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
          fontWeight: 600,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "1.25rem",
          fontFamily: "'Oswald', sans-serif",
          color: "#111827",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px 24px 24px",
          gap: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.75rem",
          fontFamily: "'Poppins', sans-serif",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'Poppins', sans-serif",
        },
      },
    },
  },
});

export default theme;
