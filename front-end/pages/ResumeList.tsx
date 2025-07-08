import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Education = { id: number; school: string; major?: string; period?: string; status?: string; };
type Career = { id: number; company: string; role?: string; period?: string; description?: string; };
type Certificate = { id: number; title: string; issuer?: string; date?: string; };
type Activity = { id: number; title: string; org?: string; period?: string; description?: string; };
type Skill = { id: number; name: string; };

type Resume = {
  id: number;
  user_id: number;
  content?: string;
  portfolio?: string;
  is_pdf?: boolean;
  created_at?: string;
  updated_at?: string;
  education: Education[];
  career: Career[];
  certificate: Certificate[];
  activity: Activity[];
  skills: Skill[];
};

export default function ResumeListPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      try {
        const res = await fetch("/api/resume/list", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          setError("이력서 목록을 불러오지 못했습니다.");
          setResumes([]);
        } else {
          const data = await res.json();
          setResumes(data.result || []);
        }
      } catch {
        setError("네트워크 에러");
        setResumes([]);
      }
      setLoading(false);
    };
    fetchResumes();
  }, []);

  if (loading) return <div className="text-center mt-10">불러오는 중...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!resumes.length) return <div className="text-center mt-10">저장된 이력서가 없습니다.</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">내 이력서 목록</h1>
      <ul className="space-y-5">
        {resumes.map(resume => (
          <li
            key={resume.id}
            className="p-4 rounded-lg border shadow flex flex-col gap-2 hover:bg-indigo-50 cursor-pointer transition"
            onClick={() => router.push(`/resume/${resume.id}`)}
          >
            <div className="flex items-center justify-between">
              <div className="font-bold text-lg text-indigo-700">이력서 #{resume.id}</div>
              <div className="text-xs text-gray-500">{resume.created_at?.slice(0, 10)}</div>
            </div>
            <div className="text-sm text-slate-700 truncate">
              {resume.content?.slice(0, 70) || <span className="text-gray-400">(내용 없음)</span>}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {resume.skills.map(s => (
                <span key={s.id} className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">{s.name}</span>
              ))}
            </div>
            <div className="text-xs text-slate-400">
              {resume.education.map(e => e.school).join(", ")}
              {resume.portfolio && (
                <>
                  <span className="mx-1 text-gray-300">|</span>
                  <a href={resume.portfolio} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">포트폴리오</a>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/resume/new")}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          + 새 이력서 작성
        </button>
      </div>
    </main>
  );
}
