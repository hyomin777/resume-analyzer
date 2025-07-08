from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class EducationCreate(BaseModel):
    school: str
    major: Optional[str] = None
    period: Optional[str] = None
    status: Optional[str] = None


class CareerCreate(BaseModel):
    company: str
    role: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None


class CertificateCreate(BaseModel):
    title: str
    issuer: Optional[str] = None
    date: Optional[str] = None


class ActivityCreate(BaseModel):
    title: str
    org: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None


class SkillCreate(BaseModel):
    name: str


class ResumeCreate(BaseModel):
    content: Optional[str] = None
    portfolio: Optional[str] = None
    is_pdf: Optional[bool] = False
    education: Optional[List[EducationCreate]] = []
    career: Optional[List[CareerCreate]] = []
    certificate: Optional[List[CertificateCreate]] = []
    activity: Optional[List[ActivityCreate]] = []
    skills: Optional[List[SkillCreate]] = []


class EducationOut(BaseModel):
    id: int
    school: str
    major: Optional[str] = None
    period: Optional[str] = None
    status: Optional[str] = None
    class Config:
        from_attributes = True


class CareerOut(BaseModel):
    id: int
    company: str
    role: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None
    class Config:
        from_attributes = True


class CertificateOut(BaseModel):
    id: int
    title: str
    issuer: Optional[str] = None
    date: Optional[str] = None
    class Config:
        from_attributes = True


class ActivityOut(BaseModel):
    id: int
    title: str
    org: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None
    class Config:
        from_attributes = True


class SkillOut(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True


class ResumeOut(BaseModel):
    id: int
    user_id: int
    content: Optional[str] = None
    portfolio: Optional[str] = None
    is_pdf: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    education: List[EducationOut] = []
    career: List[CareerOut] = []
    certificate: List[CertificateOut] = []
    activity: List[ActivityOut] = []
    skills: List[SkillOut] = []

    class Config:
        from_attributes = True
