import { useEffect, useState, useRef } from "react";
import withAuthProtection from "@/utils/withAuthProtection";
import QuestionReport, { Questions } from "@/components/QuestionReport";

function QuestionPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJD] = useState("");
  const [result, setResult] = useState<Questions | null>(null);
  const [loading, setLoading] = useState(false);

  const [resumeList, setResumeList] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (file: File | null) => {
    setResume(file);
    if (file) setSelectedResumeId(null);
  };
  const handleResumeSelect = (id: number) => {
    setSelectedResumeId(id);
    setResume(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if ((!resume && !selectedResumeId) || !jd) {
      alert("이력서와 JD를 모두 입력하세요.");
      return;
    }
    setLoading(true);

    const form = new FormData();
    if (resume) {
      form.append("file", resume);
    } else if (selectedResumeId) {
      form.append("resume_id", String(selectedResumeId));
    }
    form.append("jd_description", jd);

    const token = localStorage.getItem("token");
    const res = await fetch("/api/resume/question", {
      method: "POST",
      body: form,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    console.log(data)
    console.log(data.result)
    setResult(data.result);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 면접 질문 생성</h1>
      <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
        {/* 1. 등록 이력서 선택 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold mb-1">등록된 이력서에서 선택</label>
          <select
            className="border p-2 rounded"
            value={selectedResumeId || ""}
            onChange={e => handleResumeSelect(Number(e.target.value))}
            disabled={!!resume}
          >
            <option value="">-- 선택 안 함 --</option>
            {resumeList.map(r => (
              <option key={r.id} value={r.id}>
                {r.content?.slice(0, 20) || "이름없음"} ({r.is_pdf ? "PDF" : "작성"})
              </option>
            ))}
          </select>
        </div>

        {/* 2. PDF 업로드 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold mb-1">PDF 파일 직접 업로드</label>
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={e => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
            id="resume-upload"
            disabled={!!selectedResumeId}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition ${selectedResumeId ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={!!selectedResumeId}
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
          {loading ? "질문 생성 중..." : "질문 생성"}
        </button>
      </form>

      {loading && <div className="text-center">질문 생성 중...</div>}
      {result && <QuestionReport data={result} />}
    </main>
  );
}

export default withAuthProtection(QuestionPage);
