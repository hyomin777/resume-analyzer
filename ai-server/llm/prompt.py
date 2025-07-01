from pydantic import BaseModel, Field
from typing import List, Optional


class SkillAnalysisResult(BaseModel):
    skill: str
    rating: int
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
    feedback: List[str] = Field(default_factory=list)
    improvement_suggestions_for_applicant: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)


class Comments(BaseModel):
    applicant_perspective: str

class AnalysisSectionItem(BaseModel):
    score: int
    comments: Comments


class AnalysisSection(BaseModel):
    job_title: AnalysisSectionItem
    job_summary: AnalysisSectionItem
    responsibilities: AnalysisSectionItem
    required_qualifications: AnalysisSectionItem
    preferred_qualifications: AnalysisSectionItem
    hard_skills: AnalysisSectionItem
    soft_skills: AnalysisSectionItem
    experience: AnalysisSectionItem
    improvementSuggestions: Optional[List[str]] = Field(default_factory=list)


class OutputModel(BaseModel):
    essential: EssentialSection
    preferred: PreferredSection
    matchingSkills: List[str] = Field(default_factory=list)
    missingSkills: List[str] = Field(default_factory=list)
    similarityScores: List[float] = Field(default_factory=list)
    trendData: List[str] = Field(default_factory=list)
    overallEvaluation: OverallEvaluation
    analysis: AnalysisSection


def create_prompt(resume_content, text):
    prompt = f'''
        너는 인사 컨설팅 전문가 AI다. 아래 내용 [이력서 & 직무 설명]을 분석해서, 반드시 아래 output 포맷(샘플 리포트 구조)을 따라 '직무 역량 분석 및 컨설팅 결과'를 **JSON만으로** 작성하라.
        
        추가 설명, 불필요한 텍스트, 코드블럭, 자연어 해설 없이, 오직 JSON만 반환하라. 
        출력 구조와 key 이름, 중첩 구조, 필드명, 리스트/값의 형태가 반드시 아래 예시와 일치해야 한다.
        만약 입력 데이터에 해당 정보가 없으면 빈 리스트나 빈 값을 반드시 반환하라.

        [Output JSON Schema 예시]
        {{
            "essential": {{
                "skillAnalysisResults": [
                    {{"skill": "...", "rating": 0, "evaluation": "...", "category": "...", "subcategory": "..."}}
                ]
            }},
            "preferred": {{
                "skillAnalysisResults": [
                    {{"skill": "...", "rating": 0, "evaluation": "...", "category": "...", "subcategory": "..."}}
                ]
            }},
            "matchingSkills": [],
            "missingSkills": [],
            "similarityScores": [],
            "trendData": [],
            "overallEvaluation": {{
                "resume_feedback": [{{"category": "...", "feedback": ["..."]}}],
                "cover_letter_feedback": [{{"category": "...", "feedback": ["..."]}}],
                "feedback": ["..."],
                "improvement_suggestions_for_applicant": ["..."],
                "recommendations": ["..."]
            }},
            "analysis": {{
                "job_title": {{"score": 0, "comments": {{"applicant_perspective": "..."}}}},
                "job_summary": {{"score": 0, "comments": {{"applicant_perspective": "..."}}}},
                "responsibilities": {{"score": 0, "comments": {{"applicant_perspective": "..."}}}},
                "required_qualifications": {{"score": 0, "comments": {{"applicant_perspective": "..."}}}},
                "preferred_qualifications": {{"score": 0, "comments": {{"applicant_perspective": "..."}}}},
                "hard_skills": {{"score": 0, "comments": {{"applicant_perspective": "..."}}}},
                "soft_skills": {{"score": 0, "comments": {{"applicant_perspective": "..."}}}},
                "experience": {{"score": 0, "comments": {{"applicant_perspective": "..."}}}},
                "improvementSuggestions": ["..."]
            }}
        }}

        [이력서]
        {resume_content}

        [직무 설명]
        {text}

        위 Output JSON Schema 예시와 동일한 구조와 필드로만 작성하라.
    '''
    return prompt
