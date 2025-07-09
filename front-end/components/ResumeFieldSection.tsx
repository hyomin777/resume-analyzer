import React from "react";

type EntryWithId = { id: number } & Record<string, any>;

type Props<T extends EntryWithId> = {
  label: string;
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  fields: (keyof T)[];
};

export default function ResumeFieldSection<T extends EntryWithId>({
  label,
  data,
  setData,
  fields,
}: Props<T>) {
  const addEntry = () => {
    const newItem: T = { id: Date.now(), [fields[0]]: "" } as T;
    setData(prev => [...prev, newItem]);
  };

  const removeEntry = (index: number) => {
    setData(prev => prev.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof T, value: string) => {
    setData(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div>
      <label className="font-semibold">{label}</label>
      {data.map((item, idx) => (
        <div key={item.id} className="flex gap-2 mb-2 items-center">
          {fields.map((field, fIdx) => (
            <input
              key={fIdx}
              className="border p-1 rounded flex-1"
              placeholder={String(field)}
              value={(item[field] as string) || ""}
              onChange={e => updateEntry(idx, field, e.target.value)}
            />
          ))}
          {data.length > 1 && (
            <button
              type="button"
              onClick={() => removeEntry(idx)}
              className="text-red-500 ml-1"
            >
              삭제
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addEntry}
        className="text-blue-600 mt-1"
      >
        + {label} 추가
      </button>
    </div>
  );
}
