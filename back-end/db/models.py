from datetime import datetime, timezone
from sqlalchemy import Column, ForeignKey, JSON, DateTime, Integer, String, Text
from sqlalchemy.orm import declarative_base

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
    jd_description = Column(Text, nullable=True)


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    resume_content = Column(Text)
    jd_description = Column(Text, nullable=True)
    feedback = Column(Text, nullable=True)
    label = Column(String, nullable=True)  # 'Pass', 'Fail'
    created_at = Column(DateTime, default=datetime.now(timezone.utc))


class Result(Base):
    __tablename__ = "result"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey("user.id"), index=True)
    result = Column(JSON)