import { createTheme } from "@mui/material";
import { teal } from "@mui/material/colors";

const primaryTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: teal[500],
    },
  },
  typography: {
    fontFamily: "var(--font-primary), sans-serif",
  },
});

export default primaryTheme;
