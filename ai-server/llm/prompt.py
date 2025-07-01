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
        너는 인사 컨설팅 전문가 AI다. 아래 내용: [이력서] & [직무 설명]을 분석해서, 반드시 아래 output 포맷(샘플 리포트 구조)을 따라 '직무 역량 분석 및 컨설팅 결과'를 **JSON만으로** 작성하라.
        
        ---

        - **[중요]** [이력서]와 [직무 설명]을 반드시 **서로 연관지어** 분석하라.
        - 직무 설명의 필수/우대역량을 기준으로, 이력서에 **잘 드러난 부분**과 **부족하거나 미흡한 부분**을 명확히 구분해서 평가하고, 각 항목별로 구체적인 피드백과 개선점을 제시하라.
        - 각 영역(필수역량, 우대역량, 피드백 등)에 대해, 
            - 이력서가 JD의 요구에 **잘 부합하는 부분**(예시, 강점, 어필 요소)
            - **아쉬운 부분**(누락, 구체성 부족, 보완 필요 등) 
            - **구체적인 개선 제안**을 포함하라.
        - 만약 이력서에 특정 역량/경험이 없거나 부족할 경우, 어떻게 보완할 수 있을지 실질적 제안도 추가하라.
        - **각 항목(필수역량, 우대역량, 피드백, 개선 제안 등)에서 비슷하거나 중복되는 내용은 반복해서 쓰지 말고, 반드시 서로 다른 구체적 평가와 제안을 제시하라.**

        ---

        추가 설명, 불필요한 텍스트, 코드블럭, 자연어 해설 없이, **오직 JSON만 반환하라.** 
        출력 구조와 key 이름, 중첩 구조, 필드명, 리스트/값의 형태가 반드시 아래 예시와 일치해야 한다.
        만약 입력 데이터에 해당 정보가 없으면 빈 리스트나 빈 값을 반드시 반환하라.

        ---

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

        ---

        [직무 설명]
        {text}

        ---

        [이력서]
        {resume_content}

        ---

        위 Output JSON Schema 예시와 동일한 구조와 필드로만 작성하라.
    '''
    return prompt
