import '../styles/globals.css';
import AnalysisLayout from '../layouts/AnalysisLayout';

export default function App({ Component, pageProps }) {
  return (
    <AnalysisLayout>
      <Component {...pageProps} />
    </AnalysisLayout>
  );
}
