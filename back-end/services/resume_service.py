from typing import Optional, Union, List
from fastapi import HTTPException, Depends
from db.repositories import ResumeRepository, get_resume_repository
from db.models import Resume, Education, Career, Certificate, Activity, Skill
from schemas import ResumeCreate
from utils import extract_text_from_pdf

class ResumeService:
    def __init__(self, repo: ResumeRepository):
        self.repo = repo

    async def create_resume(
            self,
            user_id: int,
            resume_data: ResumeCreate,
            transaction: bool = True
        ) -> Resume:
        resume = Resume(
            user_id=user_id,
            content=resume_data.content,
            portfolio=resume_data.portfolio,
            is_pdf=resume_data.is_pdf,
        )
        resume.education = [Education(**e.model_dump()) for e in (resume_data.education or [])]
        resume.career = [Career(**c.model_dump()) for c in (resume_data.career or [])]
        resume.certificate = [Certificate(**c.model_dump()) for c in (resume_data.certificate or [])]
        resume.activity = [Activity(**a.model_dump()) for a in (resume_data.activity or [])]
        resume.skills = [Skill(**s.model_dump()) for s in (resume_data.skills or [])]

        if transaction:
            async with self.repo.session.begin():
                result = await self.repo.add_resume_with_relations(resume)
        else:
            result = await self.repo.add_resume_with_relations(resume)
        return result
    
    
    async def create_resume_from_pdf(self, user_id: int, pdf_bytes: bytes) -> Resume:
        content = extract_text_from_pdf(pdf_bytes)
        resume = Resume(
            user_id=user_id,
            content=content,
            is_pdf=True,
            is_active=False
        )
        result = await self.repo.add_item(resume)
        return result
    

    async def get_resume(
        self,
        user_id: int,
        resume_id: Optional[int] = None,
        is_active: bool = True
    ) -> Union[Resume, List[Resume], None]:
        return await self.repo.get_resume(user_id, resume_id, is_active)
    

    async def get_resume_with_relations(
        self,
        user_id: int,
        resume_id: Optional[int] = None,
        is_active: bool = True
    ) -> Union[Resume, List[Resume], None]:
        return await self.repo.get_resume_with_relations(user_id, resume_id, is_active)


    async def patch_resume(self, user_id: int, resume_id: int, resume_data: ResumeCreate) -> Resume:
        async with self.repo.session.begin():
            await self.repo.deactivate_resume(user_id, resume_id)
            result = await self.create_resume(user_id, resume_data, False)
        return result
    

    async def deactivate_resume(self, user_id: int, resume_id: int):
        async with self.repo.session.begin():
            resume = await self.repo.deactivate_resume(user_id, resume_id)
        return resume


    async def build_resume_content(self, user_id: int, resume_id: int) -> str:
        resume = await self.repo.get_resume_with_relations(user_id, resume_id)

        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")

        lines = []
        lines.append(f"자기소개\n{resume.content}\n")

        if resume.portfolio:
            lines.append(f"포트폴리오: {resume.portfolio}\n")

        if resume.education:
            lines.append("학력")
            for e in resume.education:
                lines.append(f"- {e.school} {e.major or ''} {e.period or ''} {e.status or ''}".strip())

        if resume.career:
            lines.append("경력")
            for c in resume.career:
                desc = (c.description or "").replace('\n', ' ')
                lines.append(f"- {c.company} {c.role or ''} {c.period or ''} {desc}".strip())

        if resume.certificate:
            lines.append("자격증")
            for cert in resume.certificate:
                lines.append(f"- {cert.title} ({cert.issuer or ''}, {cert.date or ''})".strip())

        if resume.activity:
            lines.append("대외활동/인턴")
            for a in resume.activity:
                desc = (a.description or "").replace('\n', ' ')
                lines.append(f"- {a.title} {a.org or ''} {a.period or ''} {desc}".strip())

        if resume.skills:
            skill_names = ", ".join([s.name for s in resume.skills])
            lines.append(f"기술스택: {skill_names}\n")

        content = "\n".join(lines)
        return content


def get_resume_service(
    repo: ResumeRepository = Depends(get_resume_repository)
) -> ResumeService:
    service = ResumeService(repo)
    return service