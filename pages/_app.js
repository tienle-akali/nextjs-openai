// import '@/styles/globals.css'

import { CssBaseline, ThemeProvider } from "@mui/material";
import primaryTheme from "./theme/primaryTheme";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={primaryTheme}>
      <CssBaseline enableColorScheme />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
