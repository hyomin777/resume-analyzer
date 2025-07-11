import { useEffect, useState, useRef } from "react";
import withAuthProtection from "@/utils/withAuthProtection";
import ResumeInput from "@/components/ResumeInput";
import QuestionReport, { Questions } from "@/components/QuestionReport";

function QuestionPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJD] = useState("");
  const [result, setResult] = useState<Questions | null>(null);
  const [loading, setLoading] = useState(false);

  const [resumeList, setResumeList] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

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
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI 면접 질문 생성</h1>
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
          {loading ? "질문 생성 중..." : "질문 생성"}
        </button>
      </form>

      {loading && <div className="text-center">질문 생성 중...</div>}
      {result && <QuestionReport data={result} />}
    </main>
  );
}

export default withAuthProtection(QuestionPage);
