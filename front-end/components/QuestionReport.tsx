import React, { useState } from "react";

export interface QuestionItem {
  category: string;
  question: string;
  preparation: string[];
  checkpoints: string[];
}

export interface Questions {
  questions: QuestionItem[];
}

interface QuestionReportProps {
  data?: Questions;
}

export default function QuestionReport({ data }: QuestionReportProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    data?.questions.map(q => q.category) ?? []
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  if (!data || !data.questions?.length) {
    return <div className="text-slate-400 text-center py-20">생성된 질문이 없습니다.</div>;
  }

  // 카테고리 추출
  const categories = Array.from(new Set(data.questions.map(q => q.category)));

  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-50 via-white to-green-50 rounded-2xl shadow-lg p-8 mb-10 border border-slate-200">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">예상 면접 질문 리포트</h1>
        <div className="text-slate-500 text-sm mb-2">카테고리별 질문 및 준비 체크포인트</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`rounded-full px-4 py-1 border transition-all font-semibold
                ${selectedCategories.includes(cat)
                  ? "bg-indigo-600 text-white border-indigo-600 shadow"
                  : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                }`
              }
              aria-pressed={selectedCategories.includes(cat)}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <section className="space-y-8">
        {data.questions
          .filter(q => selectedCategories.includes(q.category))
          .map((q, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 shadow-lg p-6"
            >
              <div className="font-semibold text-indigo-900 text-lg mb-2">
                [{q.category}] {q.question}
              </div>
              {q.preparation.length > 0 && (
                <div className="mb-3">
                  <div className="text-slate-600 font-semibold mb-1">후보자 준비사항</div>
                  <ul className="list-disc list-inside text-slate-800 text-sm pl-2">
                    {q.preparation.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {q.checkpoints.length > 0 && (
                <div>
                  <div className="text-slate-600 font-semibold mb-1">면접관 체크포인트</div>
                  <ul className="list-disc list-inside text-slate-800 text-sm pl-2">
                    {q.checkpoints.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
      </section>
    </div>
  );
}
