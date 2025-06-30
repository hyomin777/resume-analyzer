export type SkillResult = {
  skill: string;
  rating: number;
  evaluation: string;
  category: string;
  subcategory: string;
};

export type MatchSkill = { skill: string; value: number };
export type SimilaritySkill = { skill: string; similarity: number };
export type TrendHistory = { date: string; value: number };
export type TrendSkill = { skill: string; history: TrendHistory[] };
export type FeedbackItem = { category: string; feedback: string[] };

export interface AnalysisData {
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
  jdAnalysis?: any; // JD 분석 데이터
}
