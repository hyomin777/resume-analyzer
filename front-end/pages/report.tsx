import React, { useEffect, useState } from "react";
import { Chart as ChartJS, RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend } from "chart.js";
import { SkillBlock } from "@/components/SkillBlock";

ChartJS.register(RadialLinearScale, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

function getSkillFitText(score: number) {
  if (score >= 4.5) return "아주높음";
  if (score >= 3.5) return "높음";
  if (score >= 2.5) return "보통";
  if (score >= 1.5) return "낮음";
  if (score >= 0.5) return "아주낮음";
  return "불가능";
}

export default function ReportPage() {
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    fetch("/sample-data.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center">로딩 중...</div>;

  // 필수/우대 평균
  const essentialSkills = data.essential.skillAnalysisResults;
  const essentialAvg = Math.round((essentialSkills.reduce((sum: number, s: any) => sum + s.rating, 0) / essentialSkills.length) * 10) / 10;
  const preferredSkills = data.preferred.skillAnalysisResults;
  const preferredAvg = Math.round((preferredSkills.reduce((sum: number, s: any) => sum + s.rating, 0) / preferredSkills.length) * 10) / 10;

  return (
    <main className="container mx-auto px-4 max-w-6xl py-8">
      {/* Header */}
      <div className="blueprint p-8 rounded-lg mb-8">
        <div className="flex justify-between items-start">
          <div>
            <p className="annotation mb-1">Document Type: Assessment Report</p>
            <h1 className="text-2xl font-bold text-gray-900">지원자 역량 분석 및 컨설팅 결과</h1>
            <p className="text-sm text-gray-600 mt-2">Generated: 2024.10.27</p>
          </div>
          <div className="flex gap-4">
            <div className="metric-box px-4 py-2">
              <span className="text-red-600 font-medium">
                필수 역량 적합도: {essentialAvg} ({getSkillFitText(essentialAvg)})
              </span>
            </div>
            <div className="metric-box px-4 py-2">
              <span className="text-red-600 font-medium">
                우대 역량 적합도: {preferredAvg} ({getSkillFitText(preferredAvg)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills 분석 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <SkillBlock
          title="필수 역량"
          fitScore={essentialAvg}
          fitText={getSkillFitText(essentialAvg)}
          chartData={{
            labels: essentialSkills.map((s: any) => s.skill),
            data: essentialSkills.map((s: any) => s.rating)
          }}
          skills={essentialSkills}
        />
        <SkillBlock
          title="우대 역량"
          fitScore={preferredAvg}
          fitText={getSkillFitText(preferredAvg)}
          chartData={{
            labels: preferredSkills.map((s: any) => s.skill),
            data: preferredSkills.map((s: any) => s.rating)
          }}
          skills={preferredSkills}
        />
      </div>

      {/* Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="technical-drawing p-8 rounded">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold">이력서 피드백</h2>
            <span className="question-tag">개선 제안</span>
          </div>
          <div className="space-y-4">
            {(data.overallEvaluation.resume_feedback ?? []).map((fb: any, idx: number) => (
              <div className="metric-box p-4 mb-4" key={idx}>
                <p className="annotation mb-2">{fb.category}</p>
                {fb.feedback.map((line: string, i: number) => (
                  <p className="text-gray-800 text-sm mb-1" key={i}>
                    • {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="technical-drawing p-8 rounded">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold">자기소개서 피드백</h2>
            <span className="question-tag">개선 제안</span>
          </div>
          <div className="space-y-4">
            {(data.overallEvaluation.cover_letter_feedback ?? []).map((fb: any, idx: number) => (
              <div className="metric-box p-4 mb-4" key={idx}>
                <p className="annotation mb-2">{fb.category}</p>
                {fb.feedback.map((line: string, i: number) => (
                  <p className="text-gray-800 text-sm mb-1" key={i}>
                    • {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 주요 확인 사항/역량 개발 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="technical-drawing p-8 rounded">
          <h2 className="text-xl font-bold mb-6">주요 확인 사항</h2>
          <div className="space-y-4">
            {(data.overallEvaluation.feedback ?? []).map((txt: string, idx: number) => (
              <div className="callout pl-4" key={idx}>
                <p className="text-gray-800">{txt}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="technical-drawing p-8 rounded">
          <h2 className="text-xl font-bold mb-6">역량 개발 계획 제안</h2>
          <div className="space-y-6">
            {(data.overallEvaluation.recommendations ?? []).map((txt: string, idx: number) => (
              <div className="metric-box p-4" key={idx}>
                <p className="annotation mb-1">권장 사항 {idx + 1}</p>
                <p className="text-gray-800">{txt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
