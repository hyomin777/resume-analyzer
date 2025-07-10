import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { Education, Career, Certificate, Activity, Skill } from "@/types/resume";
import withAuthProtection from "@/utils/withAuthProtection";
import ResumeFieldSection from "@/components/ResumeFieldSection";

function ResumeEditPage() {
  const router = useRouter();
  const resumeId = router.query.id as string;

  const [content, setContent] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [education, setEducation] = useState<Education[]>([{ id: Date.now(), school: "" }]);
  const [career, setCareer] = useState<Career[]>([{ id: Date.now(), company: "" }]);
  const [certificate, setCertificate] = useState<Certificate[]>([{ id: Date.now(), title: "" }]);
  const [activity, setActivity] = useState<Activity[]>([{ id: Date.now(), title: "" }]);
  const [skills, setSkills] = useState<Skill[]>([{ id: Date.now(), name: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!resumeId) return;
    const fetchResume = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const res = await fetch(`/api/resume/${resumeId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data.content || "");
        setPortfolio(data.portfolio || "");
        setEducation(data.education.length ? data.education : [{ id: Date.now(), school: "" }]);
        setCareer(data.career.length ? data.career : [{ id: Date.now(), company: "" }]);
        setCertificate(data.certificate.length ? data.certificate : [{ id: Date.now(), title: "" }]);
        setActivity(data.activity.length ? data.activity : [{ id: Date.now(), title: "" }]);
        setSkills(data.skills.length ? data.skills : [{ id: Date.now(), name: "" }]);
      }
    };
    fetchResume();
  }, [resumeId]);

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
    
    const res = await fetch(`/api/resume/${resumeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("이력서가 수정되었습니다!");
      setTimeout(() => {
        router.push("/resume/list");
      }, 800);
    } else {
      setMessage(data.detail || "이력서 수정에 실패했습니다.");
    }
    setIsSubmitting(false);
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">이력서 수정</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
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

        <ResumeFieldSection label="학력" data={education} setData={setEducation} fields={["school", "major", "period", "status"]} />
        <ResumeFieldSection label="경력" data={career} setData={setCareer} fields={["company", "role", "period", "description"]} />
        <ResumeFieldSection label="자격증" data={certificate} setData={setCertificate} fields={["title", "issuer", "date"]} />
        <ResumeFieldSection label="활동" data={activity} setData={setActivity} fields={["title", "org", "period", "description"]} />
        <ResumeFieldSection label="기술" data={skills} setData={setSkills} fields={["name"]} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
        >
          {isSubmitting ? "수정 중..." : "이력서 수정"}
        </button>
        {message && <div className="mt-2 text-center">{message}</div>}
      </form>
    </main>
  );
}

export default withAuthProtection(ResumeEditPage);
