// import '@/styles/globals.css'

import { CssBaseline, ThemeProvider } from "@mui/material";
import { Ubuntu } from "next/font/google";
import primaryTheme from "../theme/primaryTheme";

const primary = Ubuntu({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: "400",
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={primaryTheme}>
      <CssBaseline enableColorScheme />
      <main className={primary.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
