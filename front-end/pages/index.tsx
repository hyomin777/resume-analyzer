import { useState } from "react";
import AnalysisReport from "../components/AnalysisReport";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!resume || !jd) return alert("이력서, JD 모두 입력");
    setLoading(true);

    const form = new FormData();
    form.append("resume", resume);
    form.append("jd", jd);

    const res = await fetch("/api/analyze", { method: "POST", body: form });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 이력서 역량 분석</h1>
      <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
        <input type="file" accept=".pdf" onChange={e => setResume(e.target.files?.[0] || null)} required />
        <textarea className="w-full border p-2 rounded" rows={4}
          value={jd} onChange={e => setJD(e.target.value)}
          placeholder="채용공고, JD를 입력하세요" required />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">AI 분석 시작</button>
      </form>
      {loading && <div className="text-center">분석 중...</div>}
      {result && <AnalysisReport data={result} />}
    </main>
  );
}
