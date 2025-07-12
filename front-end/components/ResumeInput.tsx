import React, { useRef } from "react";

interface ResumeInputProps {
  resumeList: any[];
  selectedResumeId: number | null;
  setSelectedResumeId: (id: number | null) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  disabled?: boolean;
}

export default function ResumeInput({
  resumeList,
  selectedResumeId,
  setSelectedResumeId,
  resumeFile,
  setResumeFile,
  disabled = false,
}: ResumeInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    setResumeFile(file);
    if (file) setSelectedResumeId(null);
  };
  const handleResumeSelect = (id: number) => {
    setSelectedResumeId(id);
    setResumeFile(null);
  };

  return (
    <div className="space-y-4">
      {/* 등록 이력서 선택 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold mb-1">등록된 이력서에서 선택</label>
        <select
          className="border p-2 rounded"
          value={selectedResumeId || ""}
          onChange={e => handleResumeSelect(Number(e.target.value))}
          disabled={!!resumeFile || disabled}
        >
          <option value="">-- 선택 안 함 --</option>
          {resumeList.map(r => (
            <option key={r.id} value={r.id}>
              {r.content?.slice(0, 20) || "이름없음"} ({r.is_pdf ? "PDF" : "작성"})
            </option>
          ))}
        </select>
      </div>

      {/* PDF 업로드 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold mb-1">PDF 파일 직접 업로드</label>
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={e => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
          id="resume-upload"
          disabled={!!selectedResumeId || disabled}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition ${selectedResumeId ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={!!selectedResumeId || disabled}
        >
          {resumeFile ? "다시 선택하기" : "PDF 파일 선택"}
        </button>
        {resumeFile && (
          <div className="text-sm text-slate-700 mt-1 flex items-center gap-2">
            <span className="font-mono">{resumeFile.name}</span>
            <span className="text-slate-400">({Math.round((resumeFile.size / 1024) * 10) / 10} KB)</span>
          </div>
        )}
      </div>
    </div>
  );
}
