from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Test(Base):
    __tablename__ = "test"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    

class Resume(Base):
    __tablename__ = "resume"

    id = Column(Integer, primary_key=True, index=True)
    resume_content = Column(String)
    text = Column(String)
