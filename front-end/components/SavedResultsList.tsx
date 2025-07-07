import { useEffect, useState } from "react";
import AnalysisReport from "../components/AnalysisReport";

export default function SavedResultsList() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/results", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          setError("결과 불러오기 실패");
          setResults([]);
        } else {
          const data = await res.json();
          setResults(data.result || []);
        }
      } catch (e) {
        setError("네트워크 에러");
        setResults([]);
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  if (loading) return <div className="text-center mt-10">불러오는 중...</div>;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!results.length) return <div className="text-center mt-10">저장된 분석 결과가 없습니다.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">저장된 분석 결과</h2>
      <ul className="space-y-4 mb-8">
        {results.map((r, idx) => (
          <li
            key={r.id || idx}
            className={`p-4 rounded-lg border shadow cursor-pointer transition hover:bg-indigo-50 ${
              selected === idx ? "bg-indigo-100" : "bg-white"
            }`}
            onClick={() => setSelected(idx)}
          >
            <div className="font-bold mb-1">
              결과 #{r.id ?? idx + 1} {r.result?.essential?.skillAnalysisResults?.length
                ? "· " + (r.result?.essential?.skillAnalysisResults[0]?.skill || "")
                : ""}
            </div>
            <div className="text-xs text-gray-500">
              저장 ID: {r.id} | 유저 ID: {r.user_id}
            </div>
            <div className="text-xs text-gray-400">
              {JSON.stringify(r.result).slice(0, 50)}...
            </div>
          </li>
        ))}
      </ul>

      {/* 선택된 결과가 있으면 상세 표시 */}
      {selected !== null && results[selected] && (
        <div className="mb-10">
          <h3 className="font-bold text-lg mb-3">
            결과 #{results[selected].id ?? selected + 1} 상세 보기
          </h3>
          <AnalysisReport data={results[selected]?.result?.result ?? {}} />
          <button
            className="mt-6 px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={() => setSelected(null)}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
}
