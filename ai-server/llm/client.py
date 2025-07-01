from openai import OpenAI
from llm.prompt import OutputModel
from config import Config

LLM_CLIENT = OpenAI(api_key=Config.OPENAI_API_KEY)

def get_llm_client():
    return LLM_CLIENT

async def get_llm_response(prompt):
    response = LLM_CLIENT.responses.parse(
        model='gpt-4o',
        input=[
            {
                "role": "system",
                "content": "You are an HR expert. All answers must be in Korean and output only valid JSON as specified."
            },
            {
                "role": "user",
                "content": prompt
            },
        ],
        temperature=0.1,
        text_format=OutputModel
    )

    result = response.output_parsed
    return result