import React from "react";
import { Radar } from "react-chartjs-2";
import type { SkillResult } from "@/types";

export function SkillBlock({
  title,
  fitScore,
  fitText,
  chartData,
  skills
}: {
  title: string;
  fitScore: number;
  fitText: string;
  chartData: { labels: string[]; data: number[] };
  skills: SkillResult[];
}) {
  return (
    <div className="technical-drawing p-8 rounded">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-500">적합도:</span>
            <div className="flex items-end">
              <span className="text-lg font-mono font-bold text-indigo-600">{fitScore}</span>
              <span className="text-lg font-bold text-gray-500">/5.0</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-1 bg-gray-200 rounded">
              <div className="h-full bg-indigo-600 rounded" style={{ width: `${fitScore * 20}%` }}></div>
            </div>
            <span className="text-xs text-gray-500">{fitText}</span>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <Radar
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: "점수",
                data: chartData.data,
                backgroundColor: "rgba(79,70,229,0.15)",
                borderColor: "#6366f1"
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } },
            plugins: { legend: { display: false } }
          }}
          height={300}
        />
      </div>
      <div>
        {skills.map((skill, idx) => (
          <div className="space-y-4 mb-6" key={idx}>
            <div className="blueprint-line text-gray-800 mb-2">{skill.skill}</div>
            <div className="flex items-center gap-4">
              <span className="measurement">점수: {skill.rating}.0</span>
              <div className="flex-1 h-1 bg-gray-200 rounded">
                <div className="h-full bg-indigo-600 rounded" style={{ width: `${skill.rating * 20}%` }}></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{skill.evaluation}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">{skill.category}</span>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded">{skill.subcategory}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
