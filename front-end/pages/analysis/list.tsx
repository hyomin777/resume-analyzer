import { useEffect, useState } from "react";
import AnalysisReport from "@/components/AnalysisReport";

export default function SavedResultsList() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 분석 결과 리스트 불러오기
  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/analyses", {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        setError("결과 불러오기 실패");
        setResults([]);
      } else {
        const data = await res.json();
        console.log(data)
        setResults(data || []);
      }
    } catch (e) {
      setError("네트워크 에러");
      setResults([]);
    }
    setLoading(false);
  };

  // 선택한 분석 결과 삭제
  const handleDelete = async (analysisId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setIsDeleting(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/analysis/${analysisId}/deactivate`, {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        alert("삭제에 실패했습니다.");
      } else {
        alert("삭제되었습니다.");
        // 삭제된 항목만 필터링해서 제거
        setResults(results.filter(r => r.id !== analysisId));
        setSelected(null);
      }
    } catch {
      alert("네트워크 에러: 삭제 실패");
    }
    setIsDeleting(false);
  };

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
              결과 #{r.id ?? idx + 1} {r.content?.essential?.skillAnalysisResults?.length
                ? "· " + (r.content?.essential?.skillAnalysisResults[0]?.skill || "")
                : ""}
            </div>
            <div className="text-xs text-gray-500">
              저장 ID: {r.id} | 유저 ID: {r.user_id}
            </div>
            <div className="text-xs text-gray-400">
              {JSON.stringify(r.content).slice(0, 50)}...
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
          <AnalysisReport data={results[selected]?.content ?? {}} />
          <div className="flex gap-2 mt-6">
            <button
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={() => setSelected(null)}
            >
              닫기
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => handleDelete(results[selected].id)}
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
