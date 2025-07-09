import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import withAuthProtection from "@/utils/withAuthProtection";
import AnalysisReport from "@/components/AnalysisReport";

function Analyze() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<null | "success" | "error" | "loading">(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!resume || !jd) return alert("이력서, JD 모두 입력");
    setLoading(true);

    const form = new FormData();
    form.append("file", resume);
    form.append("text", jd);

    const token = localStorage.getItem("token");
    const res = await fetch(
      "/api/resume/analyze",
      {
        method: "POST",
        body: form,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    const data = await res.json();

    setResult(data.result.result);
    setLoading(false);
    setSaveStatus(null);
  };

  const handleSaveResult = async () => {
    if (!result) return;
    setSaveStatus("loading");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ result }),
      });

      const data = await res.json();
      if (data.result.result) {
        setSaveStatus("success");
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 이력서 역량 분석</h1>
      <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="font-semibold mb-1 cursor-pointer">이력서 PDF 업로드</label>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={e => setResume(e.target.files?.[0] || null)}
            className="hidden"
            id="resume-upload"
            required
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
          >
            {resume ? "다시 선택하기" : "PDF 파일 선택"}
          </button>
          {resume && (
            <div className="text-sm text-slate-700 mt-1 flex items-center gap-2">
              <span className="font-mono">{resume.name}</span>
              <span className="text-slate-400">({Math.round((resume.size / 1024) * 10) / 10} KB)</span>
            </div>
          )}
        </div>

        <div>
          <textarea
            className="w-full border border-slate-300 p-2 rounded focus:outline-indigo-500"
            rows={4}
            value={jd}
            onChange={e => setJD(e.target.value)}
            placeholder="채용공고, JD를 입력하세요"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "분석 중..." : "AI 분석 시작"}
        </button>
      </form>
      {loading && <div className="text-center">분석 중...</div>}
      {result && (
        <div>
          <AnalysisReport data={result} />
          <div className="text-center mt-6">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={handleSaveResult}
              disabled={saveStatus === "loading"}
            >
              {saveStatus === "loading" ? "저장 중..." : "결과 저장"}
            </button>
            {saveStatus === "success" && (
              <div className="text-green-700 mt-2">저장 완료!</div>
            )}
            {saveStatus === "error" && (
              <div className="text-red-600 mt-2">저장 실패. 다시 시도해 주세요.</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default withAuthProtection(Analyze);