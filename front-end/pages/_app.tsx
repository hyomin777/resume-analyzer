import '../styles/globals.css';
import AnalysisLayout from '../layouts/AnalysisLayout';
import { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AnalysisLayout>
      <Component {...pageProps} />
    </AnalysisLayout>
  );
}
