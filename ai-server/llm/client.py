from openai import OpenAI
from llm.prompt import OutputModel, create_system_prompt
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
                "content": create_system_prompt()
            },
            {
                "role": "user",
                "content": prompt
            },
        ],
        temperature=0.0,
        max_output_tokens=2048,
        text_format=OutputModel
    )

    result = response.output_parsed
    return result