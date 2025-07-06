from sqlalchemy import Column, ForeignKey, JSON, Integer, String
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
    resume_content = Column(String)
    text = Column(String)


class Result(Base):
    __tablename__ = "result"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey("user.id"), index=True)
    result = Column(JSON)