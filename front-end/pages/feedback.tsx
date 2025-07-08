import { useState } from "react";

export default function Feedback() {
  const [resumeContent, setResumeContent] = useState("");
  const [jdDescription, setJdDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [label, setLabel] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        resume_content: resumeContent,
        jd_description: jdDescription,
        feedback,
        label,
      }),
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-8 space-y-6 border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">
          이력서 피드백 등록
        </h2>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            이력서 내용 <span className="text-indigo-500">*</span>
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 min-h-[100px] bg-gray-50"
            value={resumeContent}
            onChange={(e) => setResumeContent(e.target.value)}
            placeholder="이력서 텍스트 입력"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            JD 설명 <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 min-h-[60px] bg-gray-50"
            value={jdDescription}
            onChange={(e) => setJdDescription(e.target.value)}
            placeholder="채용공고(JD) 텍스트 입력 (선택)"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            피드백 <span className="text-gray-400 text-xs">(선택)</span>
          </label>
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 min-h-[60px] bg-gray-50"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="피드백 내용 입력 (선택)"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1 text-gray-700">
            라벨 <span className="text-gray-400 text-xs">(예: Pass, Fail)</span>
          </label>
          <input
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-gray-50"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="예: Pass, Fail, Pending 등"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 font-semibold rounded-lg transition bg-indigo-600 text-white hover:bg-indigo-700 shadow ${
            loading ? "opacity-70 cursor-wait" : ""
          }`}
          disabled={loading}
        >
          {loading ? "전송 중..." : "제출"}
        </button>
      </form>
      {/* 결과 출력 */}
      {result && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
          <div className="font-bold text-green-700 mb-2">서버 응답</div>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
