import os
import json
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_summary(transcript):
    prompt = f"""
Read the following transcript and return ONLY valid JSON.

Format:
{{
    "summary": "A concise summary",
    "action_items": [
        "Action item 1",
        "Action item 2"
    ]
}}

Transcript:
{transcript}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    # Print raw output for debugging
    print("RAW GEMINI RESPONSE:")
    print(repr(response.text))

    text = response.text.strip()

    # Remove markdown if Gemini wraps JSON in ```json ... ```
    if text.startswith("```"):
        text = (
            text.replace("```json", "")
                .replace("```", "")
                .strip()
        )

    try:
        parsed = json.loads(text)
    except Exception:
        # Fallback if Gemini doesn't return valid JSON
        return {
            "transcript": transcript,
            "summary": text,
            "action_items": [],
            "status": "success"
        }

    return {
        "transcript": transcript,
        "summary": parsed.get("summary", ""),
        "action_items": parsed.get("action_items", []),
        "status": "success"
    }