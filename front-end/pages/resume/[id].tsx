import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Resume } from "@/types/resume";

export default function ResumeDetailPage() {
  const router = useRouter();
  const params = typeof window !== "undefined" ? window.location.pathname.split("/") : [];
  const resumeId = params.length > 2 ? params[2] : "";

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeId) return;
    const fetchResume = async () => {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      try {
        const res = await fetch(`/api/resume/${resumeId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          setError("이력서 정보를 불러오지 못했습니다.");
          setResume(null);
        } else {
          const data = await res.json();
          setResume(data);
        }
      } catch {
        setError("네트워크 에러");
        setResume(null);
      }
      setLoading(false);
    };
    fetchResume();
  }, [resumeId]);

  if (loading) return <div className="text-center mt-10">불러오는 중...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!resume) return <div className="text-center mt-10">이력서를 찾을 수 없습니다.</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">이력서 상세</h1>
      <div className="mb-4 text-sm text-gray-500 flex gap-2 items-center">
        <span>이력서 #{resume.id}</span>
        <span>생성: {resume.created_at?.slice(0, 10)}</span>
        {resume.updated_at && <span>수정: {resume.updated_at.slice(0, 10)}</span>}
        {resume.portfolio && (
          <a href={resume.portfolio} target="_blank" rel="noopener noreferrer" className="ml-2 underline text-blue-700">포트폴리오</a>
        )}
      </div>

      {/* 자기소개 */}
      <section className="mb-6">
        <h2 className="font-semibold text-lg mb-2">자기소개</h2>
        <div className="p-3 bg-slate-50 rounded">
          {resume.content || <span className="text-gray-400">(내용 없음)</span>}
        </div>
      </section>

      {/* 학력 */}
      {resume.education.length > 0 && (
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">학력</h2>
          <ul className="pl-4 list-disc">
            {resume.education.map(e => (
              <li key={e.id} className="mb-1">
                <span className="font-bold">{e.school}</span>
                {e.major && ` / ${e.major}`}
                {e.period && ` / ${e.period}`}
                {e.status && ` / ${e.status}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 경력 */}
      {resume.career.length > 0 && (
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">경력</h2>
          <ul className="pl-4 list-disc">
            {resume.career.map(c => (
              <li key={c.id} className="mb-1">
                <span className="font-bold">{c.company}</span>
                {c.role && ` / ${c.role}`}
                {c.period && ` / ${c.period}`}
                {c.description && ` / ${c.description}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 자격증 */}
      {resume.certificate.length > 0 && (
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">자격증</h2>
          <ul className="pl-4 list-disc">
            {resume.certificate.map(cert => (
              <li key={cert.id} className="mb-1">
                <span className="font-bold">{cert.title}</span>
                {cert.issuer && ` / ${cert.issuer}`}
                {cert.date && ` / ${cert.date}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 대외활동 */}
      {resume.activity.length > 0 && (
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">대외활동/인턴</h2>
          <ul className="pl-4 list-disc">
            {resume.activity.map(a => (
              <li key={a.id} className="mb-1">
                <span className="font-bold">{a.title}</span>
                {a.org && ` / ${a.org}`}
                {a.period && ` / ${a.period}`}
                {a.description && ` / ${a.description}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 스킬 */}
      {resume.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="font-semibold text-lg mb-2">기술 스택</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map(s => (
              <span key={s.id} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">{s.name}</span>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex gap-2">
        <button
          className="bg-gray-200 px-4 py-2 rounded"
          onClick={() => router.push("/resume/list")}
        >목록으로</button>
        {/* 수정/삭제/분석 버튼 등도 여기에 추가 가능 */}
      </div>
    </main>
  );
}
