from datetime import datetime, timezone
from sqlalchemy import Column, ForeignKey, JSON, Integer, String, Text, Boolean
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    

class Resume(Base):
    __tablename__ = "resume"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey("user.id"), index=True)
    content = Column(Text)
    portfolio = Column(String(256))
    is_pdf = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))
    updated_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))

    education = relationship("Education", cascade="all, delete-orphan", back_populates="resume")
    career = relationship("Career", cascade="all, delete-orphan", back_populates="resume")
    certificate = relationship("Certificate", cascade="all, delete-orphan", back_populates="resume")
    activity = relationship("Activity", cascade="all, delete-orphan", back_populates="resume")
    skills = relationship("Skill", cascade="all, delete-orphan", back_populates="resume")


class Education(Base):
    __tablename__ = "education"
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resume.id", ondelete="CASCADE"))
    school = Column(String(128))
    major = Column(String(128))
    period = Column(String(64))
    status = Column(String(64))
    resume = relationship("Resume", back_populates="education")


class Career(Base):
    __tablename__ = "career"
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resume.id", ondelete="CASCADE"))
    company = Column(String(128))
    role = Column(String(64))
    period = Column(String(64))
    description = Column(Text)
    resume = relationship("Resume", back_populates="career")


class Certificate(Base):
    __tablename__ = "certificate"
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resume.id", ondelete="CASCADE"))
    title = Column(String(128))
    issuer = Column(String(128))
    date = Column(String(32))
    resume = relationship("Resume", back_populates="certificate")


class Activity(Base):
    __tablename__ = "activity"
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resume.id", ondelete="CASCADE"))
    title = Column(String(128))
    org = Column(String(128))
    period = Column(String(64))
    description = Column(Text)
    resume = relationship("Resume", back_populates="activity")


class Skill(Base):
    __tablename__ = "skill"
    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resume.id", ondelete="CASCADE"))
    name = Column(String(64))
    resume = relationship("Resume", back_populates="skills")


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey("user.id"), index=True)
    resume_content = Column(Text)
    jd_description = Column(Text)
    feedback = Column(Text)
    label = Column(String)  # 'Pass', 'Fail'
    created_at = Column(TIMESTAMP(timezone=True), default=lambda: datetime.now(timezone.utc))


class Result(Base):
    __tablename__ = "result"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey("user.id"), index=True)
    result = Column(JSON)