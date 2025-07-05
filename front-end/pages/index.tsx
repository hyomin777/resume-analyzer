import { useEffect, useState } from "react";
import AnalysisReport from "../components/AnalysisReport";
import LoginForm from "../components/LoginForm";
import LogoutButton from "../components/LogoutButton";
import SignupForm from "../components/SignupForm";

export default function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 로그인/회원가입 상태
  const [loggedIn, setLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) setLoggedIn(true);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!resume || !jd) return alert("이력서, JD 모두 입력");
    setLoading(true);

    const form = new FormData();
    form.append("file", resume);
    form.append("text", jd);

    const token = localStorage.getItem("token");
    const res = await fetch(
      "/api/upload-resume",
      {
        method: "POST",
        body: form,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    const data = await res.json();

    setResult(data.result.result);
    setLoading(false);
  };

  if (!loggedIn) {
    return (
      <div>
        {showSignup ? (
          <>
            <SignupForm onSignup={() => setShowSignup(false)} />
            <div className="text-center mt-2">
              이미 계정이 있으신가요?{" "}
              <button className="text-blue-600 underline" onClick={() => setShowSignup(false)}>
                로그인하기
              </button>
            </div>
          </>
        ) : (
          <>
            <LoginForm onLogin={() => setLoggedIn(true)} />
            <div className="text-center mt-2">
              계정이 없으신가요?{" "}
              <button className="text-blue-600 underline" onClick={() => setShowSignup(true)}>
                회원가입
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

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

      <div className="text-right my-6">
        <LogoutButton onLogout={() => setLoggedIn(false)} />
      </div>
      
      {loading && <div className="text-center">분석 중...</div>}
      {result && <AnalysisReport data={result} />}
    </main>
  );
}
