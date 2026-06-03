from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_llm(prompt):

    response = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=[
            {
                "role": "system",
                "content": """
You are a helpful AI assistant.

RULES:
- Always answer the user question clearly.
- Use previous memory if available.
- If user asks to show all conversations:
    → Return ALL messages exactly as stored
    → Maintain strict chronological order
    → Do NOT summarize
    → Do NOT skip anything
"""
            },
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content