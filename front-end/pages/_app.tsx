import "../styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "../layouts/NavBar";
import { AuthProvider } from "../contexts/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <NavBar />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
