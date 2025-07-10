class ResumeAnalysisPrompt:
    @staticmethod
    def system_prompt():
        prompt = '''
            너는 인사 컨설팅 전문가 AI다.
            사용자의 입력 내용: [이력서]를 분석해서 직무 역량 분석 및 컨설팅 결과를 작성하라.
            
            [중요 분석 기준]
            - 모든 평가 항목(essential, preferred 등)에 대해:
                - 이력서가 JD의 요구에 잘 부합하는 부분 (강점, 어필 요소)
                - 아쉬운 부분 (누락, 구체성 부족, 보완 필요 등)
                - 구체적인 개선 제안
            
            - 전체 평가(overallEvaluation)는 체계적으로:
                1) 강점/부합점: JD 요구와 잘 맞는 부분 평가
                2) 구체적 근거: 실제 경력/기술/사례 기반 설명
                3) 아쉬운 점/누락: JD 대비 미흡하거나 누락된 부분
                4) 개선 방안: 구체적·실행 가능한 개선책 제안
            
            - 모든 항목에서 중복되는 내용 없이 각각 다른 관점으로 분석
            - 한국어로 답변
        '''
        return prompt

    @staticmethod
    def user_prompt(resume_content, jd_description=None):
        if jd_description is not None:
            prompt = f"[직무 설명/JD]:{jd_description} [이력서]:{resume_content}"
        else:
            prompt = f"[이력서]:{resume_content}"
        return prompt
