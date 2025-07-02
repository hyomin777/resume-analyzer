import React, { useState } from 'react';
import { Bar, Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart elements
ChartJS.register(
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend
);

type SkillResult = {
  skill: string;
  rating: number;
  evaluation: string;
  category: string;
  subcategory: string;
};

type MatchSkill = { skill: string; value: number };
type SimilaritySkill = { skill: string; similarity: number };
type TrendHistory = { date: string; value: number };
type TrendSkill = { skill: string; history: TrendHistory[] };
type FeedbackItem = { category: string; feedback: string[] };

interface AnalysisReportProps {
  data: {
    essential: { skillAnalysisResults: SkillResult[] };
    preferred: { skillAnalysisResults: SkillResult[] };
    matchingSkills?: MatchSkill[];
    missingSkills?: MatchSkill[];
    similarityScores?: SimilaritySkill[];
    trendData?: TrendSkill[];
    overallEvaluation?: {
      resume_feedback?: FeedbackItem[];
      cover_letter_feedback?: FeedbackItem[];
    };
  };
}

export default function AnalysisReport({ data }: AnalysisReportProps) {
  const resumeFeedback: FeedbackItem[] = data.overallEvaluation?.resume_feedback ?? [];
  const coverFeedback: FeedbackItem[] = data.overallEvaluation?.cover_letter_feedback ?? [];

  // 피드백 카테고리 선택 상태
  const [selectedResumeCategories, setSelectedResumeCategories] = useState<string[]>(
    resumeFeedback.map((f) => f.category)
  );
  const [selectedCoverCategories, setSelectedCoverCategories] = useState<string[]>(
    coverFeedback.map((f) => f.category)
  );

  const toggleResumeCategory = (cat: string) =>
    setSelectedResumeCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  const toggleCoverCategory = (cat: string) =>
    setSelectedCoverCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  // Chart data
  const essential = data.essential.skillAnalysisResults;
  const preferred = data.preferred.skillAnalysisResults;
  const matching = data.matchingSkills ?? [];
  const missing = data.missingSkills ?? [];
  const similarity = data.similarityScores ?? [];
  const trends = data.trendData ?? [];

  // 적합도 산출(평균값)
  const avg = (list: number[]) =>
    list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : 0;
  const essentialScore = avg(essential.map((s) => Number(s.rating)));
  const preferredScore = avg(preferred.map((s) => Number(s.rating)));
  const essentialLevel =
    essentialScore >= 4.5 ? '아주높음'
      : essentialScore >= 3.5 ? '높음'
      : essentialScore >= 2.5 ? '보통'
      : essentialScore >= 1.5 ? '낮음'
      : '매우낮음';
  const preferredLevel =
    preferredScore >= 4.5 ? '아주높음'
      : preferredScore >= 3.5 ? '높음'
      : preferredScore >= 2.5 ? '보통'
      : preferredScore >= 1.5 ? '낮음'
      : '매우낮음';

  return (
    <div>
      {/* 상단 요약 카드 */}
      <div className="bg-gradient-to-r from-indigo-50 via-white to-green-50 rounded-2xl shadow-lg p-8 mb-10 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="text-xs text-slate-400 font-mono mb-1">Document Type: Assessment Report</div>
          <h1 className="text-2xl font-extrabold text-gray-900">지원자 역량 분석 및 컨설팅 결과</h1>
          <div className="text-xs text-slate-500 mt-2">
            Generated: {new Date().toISOString().slice(0, 10)}
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <div className="bg-white border-l-4 border-indigo-500 px-4 py-2 rounded-lg shadow-sm">
            <span className="text-indigo-700 font-bold">
              필수 역량 적합도: {essentialScore} ({essentialLevel})
            </span>
          </div>
          <div className="bg-white border-l-4 border-green-500 px-4 py-2 rounded-lg shadow-sm">
            <span className="text-green-700 font-bold">
              우대 역량 적합도: {preferredScore} ({preferredLevel})
            </span>
          </div>
        </div>
      </div>

      {/* 실제 리포트 컨테이너 */}
      <section id="report-container" className="space-y-12">
        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 필수 역량 */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6">
            <h2 className="font-bold text-lg mb-2">필수 역량</h2>
            <div className="h-80">
              <Radar
                data={{
                  labels: essential.map((s) => s.skill),
                  datasets: [
                    {
                      label: '점수',
                      data: essential.map((s) => s.rating),
                      backgroundColor: 'rgba(79,70,229,0.13)',
                      borderColor: '#6366f1',
                    },
                  ],
                }}
                options={{
                  scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } },
                  plugins: { legend: { display: false } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <ul className="mt-5 space-y-4">
              {essential.map((s, i) => (
                <li key={i} className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="font-bold text-slate-800">{s.skill}
                    <span className="ml-2 inline-block px-2 py-0.5 bg-slate-100 text-xs rounded">{s.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-indigo-700 font-mono">
                    점수: {s.rating}
                    <div className="w-32 h-2 rounded bg-indigo-100">
                      <div
                        className="h-2 bg-indigo-600 rounded"
                        style={{ width: `${(Number(s.rating) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-slate-600 text-sm">{s.evaluation}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* 우대 역량 */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6">
            <h2 className="font-bold text-lg mb-2">우대 역량</h2>
            <div className="h-80">
              <Radar
                data={{
                  labels: preferred.map((s) => s.skill),
                  datasets: [
                    {
                      label: '점수',
                      data: preferred.map((s) => s.rating),
                      backgroundColor: 'rgba(16,185,129,0.11)',
                      borderColor: '#10b981',
                    },
                  ],
                }}
                options={{
                  scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } },
                  plugins: { legend: { display: false } },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
            <ul className="mt-5 space-y-4">
              {preferred.map((s, i) => (
                <li key={i} className="flex flex-col gap-1 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="font-bold text-slate-800">{s.skill}
                    <span className="ml-2 inline-block px-2 py-0.5 bg-slate-100 text-xs rounded">{s.category}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-emerald-700 font-mono">
                    점수: {s.rating}
                    <div className="w-32 h-2 rounded bg-emerald-100">
                      <div
                        className="h-2 bg-emerald-500 rounded"
                        style={{ width: `${(Number(s.rating) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-slate-600 text-sm">{s.evaluation}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 바 차트 */}
        {(matching.length > 0 || missing.length > 0 || similarity.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {matching.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6">
                <h2 className="font-bold text-lg mb-2">JD 매칭 스킬 현황</h2>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: matching.map((m) => m.skill),
                      datasets: [
                        {
                          label: '매칭도',
                          data: matching.map((m) => m.value),
                          backgroundColor: 'rgba(79,70,229,0.5)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { title: { display: true, text: '스킬' }, ticks: { maxRotation: 45, minRotation: 45 } },
                        y: { min: 0, max: 5, ticks: { stepSize: 1 }, title: { display: true, text: '점수' } },
                      },
                      plugins: { legend: { display: false } }
                    }}
                  />
                </div>
              </div>
            )}
            {missing.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6">
                <h2 className="font-bold text-lg mb-2">부족 스킬 현황</h2>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: missing.map((m) => m.skill),
                      datasets: [
                        {
                          label: '부족도',
                          data: missing.map((m) => m.value),
                          backgroundColor: 'rgba(239,68,68,0.5)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { title: { display: true, text: '스킬' }, ticks: { maxRotation: 45, minRotation: 45 } },
                        y: { min: 0, max: 5, ticks: { stepSize: 1 }, title: { display: true, text: '점수' } },
                      },
                      plugins: { legend: { display: false } }
                    }}
                  />
                </div>
              </div>
            )}
            {similarity.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6 col-span-2">
                <h2 className="font-bold text-lg mb-2">스킬 유사도 (0.0–1.0)</h2>
                <div className="h-64">
                  <Bar
                    data={{
                      labels: similarity.map((s) => s.skill),
                      datasets: [
                        {
                          label: '유사도',
                          data: similarity.map((s) => s.similarity),
                          backgroundColor: 'rgba(79,70,229,0.5)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { title: { display: true, text: '스킬' }, ticks: { maxRotation: 45, minRotation: 45 } },
                        y: { min: 0, max: 1, ticks: { stepSize: 0.1 }, title: { display: true, text: '유사도' } },
                      },
                      plugins: { legend: { display: false } }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 성장 추세 */}
        {trends.length > 0 && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6">
            <h2 className="font-bold text-xl mb-4">스킬 성장 추세</h2>
            <div className="space-y-8">
              {trends.map((t, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold mb-2">{t.skill} 성장 추이</h3>
                  <div className="h-56">
                    <Line
                      data={{
                        labels: t.history.map((h) => h.date),
                        datasets: [
                          {
                            label: '점수',
                            data: t.history.map((h) => h.value),
                            tension: 0.3,
                            fill: false,
                            borderColor: '#4f46e5',
                            backgroundColor: 'rgba(79,70,229,0.15)',
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          x: { title: { display: true, text: '시점' } },
                          y: { min: 0, max: 5, ticks: { stepSize: 1 }, title: { display: true, text: '점수' } },
                        },
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 이력서/자소서 피드백 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 이력서 피드백 */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">이력서 피드백</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {resumeFeedback.map((f) => (
                <button
                  key={f.category}
                  className={`rounded-full px-4 py-1 border transition-all font-semibold
                    ${selectedResumeCategories.includes(f.category)
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                      : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                    }`
                  }
                  aria-pressed={selectedResumeCategories.includes(f.category)}
                  onClick={() => toggleResumeCategory(f.category)}
                >
                  {f.category}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {resumeFeedback
                .filter((f) => selectedResumeCategories.includes(f.category))
                .map((f) => (
                  <div key={f.category} className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500">
                    <div className="font-semibold text-indigo-900 mb-2">{f.category}</div>
                    <ul className="list-disc list-inside text-sm space-y-1 text-slate-800">
                      {f.feedback.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>

          {/* 자기소개서 피드백 */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">자기소개서 피드백</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {coverFeedback.map((fm) => (
                <button
                  key={fm.category}
                  className={`rounded-full px-4 py-1 border transition-all font-semibold
                    ${selectedCoverCategories.includes(fm.category)
                      ? 'bg-green-600 text-white border-green-600 shadow'
                      : 'bg-white text-green-700 border-green-200 hover:bg-green-50'
                    }`
                  }
                  aria-pressed={selectedCoverCategories.includes(fm.category)}
                  onClick={() => toggleCoverCategory(fm.category)}
                >
                  {fm.category}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {coverFeedback
                .filter((fm) => selectedCoverCategories.includes(fm.category))
                .map((fm) => (
                  <div key={fm.category} className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div className="font-semibold text-green-900 mb-2">{fm.category}</div>
                    <ul className="list-disc list-inside text-sm space-y-1 text-slate-800">
                      {fm.feedback.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
