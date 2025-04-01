import { createTheme, ThemeOptions } from "@mui/material/styles"
import "inter-ui/inter.css"

export const repoTheme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
      contrastText: "#FFFFFF"
    },
    secondary: {
      main: "#4285F4"
    },

    background: {
      default: "#F8FCF7",
      paper: "#FFFFFF"
    },
    text: {
      primary: "#000000",
      secondary: "#757575"
    }
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700
    },
    body1: {
      fontSize: "1rem"
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: /* CSS */ ` 
        html { font-family: "Inter", "Inter var", Arial, sans-serif; }
        @supports (font-variation-settings: normal) {
          html { font-family: "Inter var", Arial, sans-serif; }
        }
       
        h1, h2, h3, h4, h5, h6, p {
          margin: 0;
        }
      `
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#4CAF50",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#45a049"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          borderRadius: "8px"
        }
      }
    }
  }
})
