from pydantic import BaseModel, Field
from typing import List


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


class TrendHistory(BaseModel):
    date: str
    value: float


class TrendSkill(BaseModel):
    skill: str
    history: List[TrendHistory] = Field(default_factory=list)


class SkillValue(BaseModel):
    skill: str
    value: float


class SimilaritySkill(BaseModel):
    skill: str
    similarity: float


class OutputModel(BaseModel):
    essential: EssentialSection
    preferred: PreferredSection
    matchingSkills: List[SkillValue] = Field(default_factory=list)
    missingSkills: List[SkillValue] = Field(default_factory=list)
    similarityScores: List[SimilaritySkill] = Field(default_factory=list)
    trendData: List[TrendSkill] = Field(default_factory=list)
    overallEvaluation: OverallEvaluation


def create_system_prompt():
    prompt = f'''
        너는 인사 컨설팅 전문가 AI다.
        사용자의 입력 내용: [이력서]를 분석해서, 아래 [Output JSON Schema 예시]를 따라 '직무 역량 분석 및 컨설팅 결과'를 **JSON만으로** 작성하라.
        
        ---

        [중요]
        - 모든 평가 항목(essential, preferred 등)에 대해, 
            - 이력서가 JD의 요구에 **잘 부합하는 부분**(예시, 강점, 어필 요소)
            - **아쉬운 부분**(누락, 구체성 부족, 보완 필요 등) 
            - **구체적인 개선 제안**을 포함하라.
        - overallEvaluation의 하위 항목(resume_feedback, cover_letter_feedback)은 반드시 아래와 같이 **체계적이고 단계적**으로 작성하라.
            1) 강점/부합점: 이력서에서 JD 요구와 잘 맞는 부분을 먼저 명확히 평가하라.
            2) 구체적 근거: 해당 강점을 실제 경력/기술/사례 기반으로 구체적으로 설명하라.
            3) 아쉬운 점/누락: JD 요구 대비 미흡하거나 누락된 부분이 있다면 반드시 명확히 서술하라.
            4) 개선 방안: 해당 미흡점 보완을 위한 구체적·실행 가능한 개선책을 제안하라.
        - 모든 항목(필수역량, 우대역량, 피드백, 개선 제안 등)에서 **중복되는 내용 없이**, 각각 다른 강점·아쉬운 점·개선 방안을 구체적으로 제시하라.
        
        ---

        추가 설명, 불필요한 텍스트, 코드블럭, 자연어 해설 없이, **오직 JSON만 반환하라.** 
        출력 구조와 key 이름, 중첩 구조, 필드명, 리스트/값의 형태가 반드시 아래 예시와 일치해야 한다.
        만약 입력 데이터에 해당 정보가 없으면 빈 리스트나 빈 값을 반드시 반환하라.
        한국어로 답변하라.

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
            "matchingSkills": [
                {{ "skill": "Python", "value": 4 }},
                {{ "skill": "Pandas", "value": 3 }}
            ],
            "missingSkills": [
                {{ "skill": "Docker", "value": 2 }}
            ],
            "similarityScores": [
                {{ "skill": "Python", "similarity": 0.9 }},
                {{ "skill": "TensorFlow", "similarity": 0.7 }}
            ],
            "trendData": [
                {{
                    "skill": "Python",
                    "history": [
                    {{ "date": "2024-06", "value": 3 }},
                    {{ "date": "2024-07", "value": 4 }}
                    ]
                }},
                {{
                    "skill": "Deep Learning",
                    "history": [
                    {{ "date": "2024-06", "value": 2.5 }},
                    {{ "date": "2024-07", "value": 3.5 }}
                    ]
                }}
            ],
            "overallEvaluation": {{
                "resume_feedback": [
                    {{"category": "...", "feedback": ["..."]}},
                    {{"category": "...", "feedback": ["..."]}},
                ],
                "cover_letter_feedback": [
                    {{"category": "...", "feedback": ["..."]}},
                    {{"category": "...", "feedback": ["..."]}},
                ]
            }}
        }}
    '''
    return prompt


def create_user_prompt(resume_content, jd_description=None):
    if jd_description is not None:
        prompt = f"[직무 설명/JD]:{jd_description} [이력서]:{resume_content}"
    else:
        prompt = f"[이력서]:{resume_content}"
    return prompt
