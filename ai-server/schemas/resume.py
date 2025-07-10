from pydantic import BaseModel, Field
from typing import List


class SkillAnalysisResult(BaseModel):
    skill: str
    rating: float = Field(ge=0, le=5)
    evaluation: str
    category: str
    subcategory: str


class EssentialSection(BaseModel):
    skillAnalysisResults: List[SkillAnalysisResult] = Field(default_factory=list)


class PreferredSection(BaseModel):
    skillAnalysisResults: List[SkillAnalysisResult] = Field(default_factory=list)


class ResumeFeedbackItem(BaseModel):
    category: str
    feedback: List[str] = Field(default_factory=list)


class CoverLetterFeedbackItem(BaseModel):
    category: str
    feedback: List[str] = Field(default_factory=list)


class OverallEvaluation(BaseModel):
    resume_feedback: List[ResumeFeedbackItem] = Field(default_factory=list)
    cover_letter_feedback: List[CoverLetterFeedbackItem] = Field(default_factory=list)


class TrendHistory(BaseModel):
    date: str
    value: float = Field(ge=0, le=5)


class TrendSkill(BaseModel):
    skill: str
    history: List[TrendHistory] = Field(default_factory=list)


class SkillValue(BaseModel):
    skill: str
    value: float = Field(ge=0, le=5)


class SimilaritySkill(BaseModel):
    skill: str
    similarity: float = Field(ge=0.0, le=1.0)


class ResumeAnalysis(BaseModel):
    essential: EssentialSection
    preferred: PreferredSection
    matchingSkills: List[SkillValue] = Field(default_factory=list)
    missingSkills: List[SkillValue] = Field(default_factory=list)
    similarityScores: List[SimilaritySkill] = Field(default_factory=list)
    trendData: List[TrendSkill] = Field(default_factory=list)
    overallEvaluation: OverallEvaluation