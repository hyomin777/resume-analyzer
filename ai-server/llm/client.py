from openai import OpenAI
from config import Config

LLM_CLIENT = OpenAI(api_key=Config.OPENAI_API_KEY)

def get_llm_client():
    return LLM_CLIENT

async def get_llm_response(system_prompt, user_prompt, text_format):
    response = LLM_CLIENT.responses.parse(
        model='gpt-4o',
        input=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            },
        ],
        temperature=0.0,
        max_output_tokens=2048,
        text_format=text_format
    )

    result = response.output_parsed
    return result