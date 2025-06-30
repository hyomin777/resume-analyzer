import { Radar } from "react-chartjs-2";

const jdKeys = [
  { key: "job_title", label: "직무명" },
  { key: "job_summary", label: "직무 개요" },
  { key: "responsibilities", label: "책임 사항" },
  { key: "required_qualifications", label: "필수 자격" },
  { key: "preferred_qualifications", label: "우대 사항" },
  { key: "hard_skills", label: "하드 스킬" },
  { key: "soft_skills", label: "소프트 스킬" },
  { key: "experience", label: "경험" }
];

const getQualityDescription = (score: number) => {
  if (score >= 4.5) return "매우 우수한 채용공고입니다. 지원자들이 이해하기 쉽고 명확한 정보를 제공하고 있습니다.";
  if (score >= 3.5) return "우수한 채용공고입니다. 대부분의 필요 정보가 잘 정리되어 있습니다.";
  if (score >= 2.5) return "보통 수준의 채용공고입니다. 일부 개선이 필요할 수 있습니다.";
  if (score >= 1.5) return "미흡한 수준의 채용공고입니다. 주요 정보가 부족하거나 불명확합니다.";
  return "매우 미흡한 수준의 채용공고입니다. 전반적인 개선이 필요합니다.";
};

export function JDAnalysisSection({
  jdAnalysis
}: {
  jdAnalysis: {
    [key: string]: {
      score: number;
      comments: { applicant_perspective: string };
    },
    improvementSuggestions?: string[]
  }
}) {
  const scores = jdKeys.map((k) => jdAnalysis[k.key]?.score ?? 0);
  const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  return (
    <div className="technical-drawing p-8 rounded mb-12">
      <h2 className="text-xl font-bold mb-6">채용공고 분석</h2>
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">JD 품질 점수</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-mono font-bold text-indigo-600">{avgScore}</span>
            <span className="text-lg font-bold text-gray-500">/5.0</span>
          </div>
          <div className="relative">
            <div className="flex-1 h-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-300 ${avgScore >= 4.5 ? "bg-green-500" : avgScore >= 3.5 ? "bg-blue-500" : avgScore >= 2.5 ? "bg-yellow-500" : avgScore >= 1.5 ? "bg-orange-500" : "bg-red-500"}`}
                style={{ width: `${(avgScore / 5) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>매우 미흡</span>
              <span>미흡</span>
              <span>보통</span>
              <span>우수</span>
              <span>매우 우수</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{getQualityDescription(avgScore)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="mb-6">
            <Radar
              data={{
                labels: jdKeys.map((k) => k.label),
                datasets: [
                  {
                    label: "JD 품질 점수",
                    data: scores,
                    backgroundColor: "rgba(79, 70, 229, 0.2)",
                    borderColor: "rgba(79, 70, 229, 1)",
                    borderWidth: 2,
                    pointBackgroundColor: "rgba(79, 70, 229, 1)",
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: { stepSize: 1 },
                    pointLabels: { font: { size: 13 } }
                  }
                },
                plugins: { legend: { display: false } }
              }}
              height={300}
            />
          </div>
          <div className="space-y-6">
            {jdKeys.map(({ key, label }) => (
              <div className="space-y-4" key={key}>
                <div className="blueprint-line text-gray-800">{label}</div>
                <div className="flex items-center gap-4">
                  <span className="measurement">
                    점수: <span>{jdAnalysis[key]?.score ?? 0}</span>.0
                  </span>
                  <div className="flex-1 h-1 bg-gray-200 rounded">
                    <div
                      className="h-full bg-indigo-600 rounded"
                      style={{
                        width: `${((jdAnalysis[key]?.score ?? 0) / 5) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {jdAnalysis[key]?.comments?.applicant_perspective ?? ""}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">지원자를 위한 주의 사항</h3>
          <div className="space-y-4">
            {(jdAnalysis?.improvementSuggestions ?? []).map((txt: string, idx: number) => (
              <div className="metric-box p-4" key={idx}>
                <p className="annotation mb-1">제안 {idx + 1}</p>
                <p className="text-gray-800">{txt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
