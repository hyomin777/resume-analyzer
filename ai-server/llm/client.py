from openai import OpenAI
from config import Config

LLM_CLIENT = OpenAI(api_key=Config.OPENAI_API_KEY)

def get_llm_client():
    return LLM_CLIENT