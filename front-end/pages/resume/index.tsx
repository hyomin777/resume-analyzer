import { useState } from "react";
import { useRouter } from "next/navigation";
import { UNDERSCORE_NOT_FOUND_ROUTE } from "next/dist/shared/lib/constants";

type Education = {
  school: string;
  major?: string;
  period?: string;
  status?: string;
};

type Career = {
  company: string;
  role?: string;
  period?: string;
  description?: string;
};

type Certificate = {
  title: string;
  issuer?: string;
  date?: string;
};

type Activity = {
  title: string;
  org?: string;
  period?: string;
  description?: string;
};

type Skill = {
  name: string;
};

export default function ResumeCreatePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [education, setEducation] = useState<Education[]>([{ school: "" }]);
  const [career, setCareer] = useState<Career[]>([{ company: "" }]);
  const [certificate, setCertificate] = useState<Certificate[]>([{ title: "" }]);
  const [activity, setActivity] = useState<Activity[]>([{ title: "" }]);
  const [skills, setSkills] = useState<Skill[]>([{ name: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const addEducation = () => setEducation([...education, { school: "" }]);
  const removeEducation = (idx: number) => setEducation(education.filter((_, i) => i !== idx));
  const updateEducation = (idx: number, field: string, value: string) =>
    setEducation(education.map((edu, i) => i === idx ? { ...edu, [field]: value } : edu));

  const addCareer = () => setCareer([...career, { company: "" }]);
  const removeCareer = (idx: number) => setCareer(career.filter((_, i) => i !== idx));
  const updateCareer = (idx: number, field: string, value: string) =>
    setCareer(career.map((c, i) => i === idx ? { ...c, [field]: value } : c));

  const addCertificate = () => setCertificate([...certificate, { title: "" }]);
  const removeCertificate = (idx: number) => setCertificate(certificate.filter((_, i) => i !== idx));
  const updateCertificate = (idx: number, field: string, value: string) =>
    setCertificate(certificate.map((c, i) => i === idx ? { ...c, [field]: value } : c));

  const addActivity = () => setActivity([...activity, { title: "" }]);
  const removeActivity = (idx: number) => setActivity(activity.filter((_, i) => i !== idx));
  const updateActivity = (idx: number, field: string, value: string) =>
    setActivity(activity.map((a, i) => i === idx ? { ...a, [field]: value } : a));

  const addSkill = () => setSkills([...skills, { name: "" }]);
  const removeSkill = (idx: number) => setSkills(skills.filter((_, i) => i !== idx));
  const updateSkill = (idx: number, value: string) =>
    setSkills(skills.map((s, i) => i === idx ? { name: value } : s));

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const body = {
      content,
      portfolio,
      is_pdf: false,
      education: education.filter(e => e.school),
      career: career.filter(c => c.company),
      certificate: certificate.filter(c => c.title),
      activity: activity.filter(a => a.title),
      skills: skills.filter(s => s.name),
    };

    const res = await fetch("/api/resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("이력서가 저장되었습니다!");
      setTimeout(() => {
        router.push("/resume/list");
      }, 60)
    } else {
      setMessage(data.detail || "이력서 저장에 실패했습니다.");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">이력서 작성</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* 자기소개 */}
        <div>
          <label className="font-semibold">자기소개</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="자신을 소개하세요"
            required
          />
        </div>
        {/* 포트폴리오 */}
        <div>
          <label className="font-semibold">포트폴리오(선택)</label>
          <input
            type="url"
            className="w-full border p-2 rounded"
            value={portfolio}
            onChange={e => setPortfolio(e.target.value)}
            placeholder="ex) https://github.com/yourname"
          />
        </div>
        {/* 학력 */}
        <div>
          <label className="font-semibold">학력</label>
          {education.map((edu, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input className="border p-1 rounded w-2/5"
                placeholder="학교명" value={edu.school}
                onChange={e => updateEducation(idx, "school", e.target.value)} />
              <input className="border p-1 rounded w-1/5"
                placeholder="전공" value={edu.major || ""}
                onChange={e => updateEducation(idx, "major", e.target.value)} />
              <input className="border p-1 rounded w-1/5"
                placeholder="기간" value={edu.period || ""}
                onChange={e => updateEducation(idx, "period", e.target.value)} />
              <input className="border p-1 rounded w-1/5"
                placeholder="상태" value={edu.status || ""}
                onChange={e => updateEducation(idx, "status", e.target.value)} />
              {education.length > 1 && (
                <button type="button" onClick={() => removeEducation(idx)}
                  className="text-red-500 ml-1">삭제</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addEducation}
            className="text-blue-600 mt-1">+ 학력 추가</button>
        </div>
        {/* 경력 */}
        <div>
          <label className="font-semibold">경력</label>
          {career.map((c, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input className="border p-1 rounded w-2/6"
                placeholder="회사명" value={c.company}
                onChange={e => updateCareer(idx, "company", e.target.value)} />
              <input className="border p-1 rounded w-1/6"
                placeholder="직무/역할" value={c.role || ""}
                onChange={e => updateCareer(idx, "role", e.target.value)} />
              <input className="border p-1 rounded w-1/6"
                placeholder="기간" value={c.period || ""}
                onChange={e => updateCareer(idx, "period", e.target.value)} />
              <input className="border p-1 rounded w-2/6"
                placeholder="업무 설명" value={c.description || ""}
                onChange={e => updateCareer(idx, "description", e.target.value)} />
              {career.length > 1 && (
                <button type="button" onClick={() => removeCareer(idx)}
                  className="text-red-500 ml-1">삭제</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addCareer}
            className="text-blue-600 mt-1">+ 경력 추가</button>
        </div>
        {/* 자격증 */}
        <div>
          <label className="font-semibold">자격증</label>
          {certificate.map((c, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input className="border p-1 rounded w-2/6"
                placeholder="자격증명" value={c.title}
                onChange={e => updateCertificate(idx, "title", e.target.value)} />
              <input className="border p-1 rounded w-2/6"
                placeholder="발급기관" value={c.issuer || ""}
                onChange={e => updateCertificate(idx, "issuer", e.target.value)} />
              <input className="border p-1 rounded w-1/6"
                placeholder="취득일" value={c.date || ""}
                onChange={e => updateCertificate(idx, "date", e.target.value)} />
              {certificate.length > 1 && (
                <button type="button" onClick={() => removeCertificate(idx)}
                  className="text-red-500 ml-1">삭제</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addCertificate}
            className="text-blue-600 mt-1">+ 자격증 추가</button>
        </div>
        {/* 활동 */}
        <div>
          <label className="font-semibold">대외활동/인턴</label>
          {activity.map((a, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input className="border p-1 rounded w-2/6"
                placeholder="활동명" value={a.title}
                onChange={e => updateActivity(idx, "title", e.target.value)} />
              <input className="border p-1 rounded w-2/6"
                placeholder="기관" value={a.org || ""}
                onChange={e => updateActivity(idx, "org", e.target.value)} />
              <input className="border p-1 rounded w-1/6"
                placeholder="기간" value={a.period || ""}
                onChange={e => updateActivity(idx, "period", e.target.value)} />
              <input className="border p-1 rounded w-2/6"
                placeholder="설명" value={a.description || ""}
                onChange={e => updateActivity(idx, "description", e.target.value)} />
              {activity.length > 1 && (
                <button type="button" onClick={() => removeActivity(idx)}
                  className="text-red-500 ml-1">삭제</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addActivity}
            className="text-blue-600 mt-1">+ 활동 추가</button>
        </div>
        {/* 스킬 */}
        <div>
          <label className="font-semibold">보유 기술</label>
          {skills.map((s, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <input
                className="border p-1 rounded w-4/5"
                placeholder="기술명" value={s.name}
                onChange={e => updateSkill(idx, e.target.value)}
              />
              {skills.length > 1 && (
                <button type="button" onClick={() => removeSkill(idx)}
                  className="text-red-500 ml-1">삭제</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addSkill}
            className="text-blue-600 mt-1">+ 기술 추가</button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {isSubmitting ? "저장 중..." : "이력서 저장"}
        </button>
        {message && <div className="mt-2 text-center">{message}</div>}
      </form>
    </main>
  );
}
