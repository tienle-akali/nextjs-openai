import { createTheme } from "@mui/material";
import { teal } from "@mui/material/colors";

const primaryTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: teal[500],
    },
  },
});

export default primaryTheme;
