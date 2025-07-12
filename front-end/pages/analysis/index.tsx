import { useEffect, useState, useRef } from "react";
import withAuthProtection from "@/utils/withAuthProtection";
import ResumeInput from "@/components/ResumeInput";
import AnalysisReport from "@/components/AnalysisReport";

function Analysis() {
  const [resume, setResume] = useState<File | null>(null); // PDF
  const [jd, setJD] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<null | "success" | "error" | "loading">(null);

  // 추가: 등록된 이력서
  const [resumeList, setResumeList] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 등록된 이력서 목록 불러오기
  useEffect(() => {
    const fetchResumes = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/resumes", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setResumeList(data || []);
    };
    fetchResumes();
  }, []);

  // 분석 요청
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if ((!resume && !selectedResumeId) || !jd) return alert("이력서와 JD를 모두 입력하세요.");
    setLoading(true);

    const form = new FormData();
    if (resume) {
      form.append("file", resume);
    } else if (selectedResumeId) {
      form.append("resume_id", String(selectedResumeId));
    }
    form.append("jd_description", jd);

    const token = localStorage.getItem("token");
    const res = await fetch("/api/resume/analysis", {
      method: "POST",
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();

    setResult(data);
    setLoading(false);
    setSaveStatus(null);
  };

  // 분석 결과 저장
  const handleSaveResult = async () => {
    if (!result) return;
    setSaveStatus("loading");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(result),
      });

      const data = await res.json();
      if (data) {
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
        {/* 이력서 선택 or pdf 파일 선택 */}
        <ResumeInput
            resumeList={resumeList}
            selectedResumeId={selectedResumeId}
            setSelectedResumeId={setSelectedResumeId}
            resumeFile={resume}
            setResumeFile={setResume}
        />

        {/* JD 입력 */}
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

export default withAuthProtection(Analysis);
