import json
import os

from google import genai

from .agent_tools import search_meetings, generate_followup_email

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

TOOLS = [
    {
        "name": "search_meetings",
        "description": "Search previous meetings by keyword.",
        "parameters": {
            "type": "object",
            "properties": {
                "keyword": {
                    "type": "string",
                    "description": "Keyword to search for."
                }
            },
            "required": ["keyword"]
        }
    },
    {
        "name": "generate_followup_email",
        "description": "Generate a follow-up email from a meeting summary.",
        "parameters": {
            "type": "object",
            "properties": {
                "summary": {
                    "type": "string"
                }
            },
            "required": ["summary"]
        }
    }
]

def run_agent(query):
    prompt = f"""
You are VoiceBridge AI.

You have these tools:
1. search_meetings(keyword)
2. generate_followup_email(summary)

If the user asks about previous meetings, use search_meetings.
If the user asks to draft an email, use generate_followup_email.

User:
{query}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text

    