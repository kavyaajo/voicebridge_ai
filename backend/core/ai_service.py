import os
import json
from google import genai

# Initialize Gemini client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


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

    try:
        # Call Gemini
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        # Remove markdown code blocks if Gemini returns ```json ... ```
        if text.startswith("```"):
            text = (
                text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        # Try parsing JSON
        try:
            parsed = json.loads(text)

            return {
                "transcript": transcript,
                "summary": parsed.get("summary", ""),
                "action_items": parsed.get("action_items", []),
                "status": "success",
            }

        except json.JSONDecodeError:
            # Fallback if Gemini returns plain text instead of JSON
            return {
                "transcript": transcript,
                "summary": text,
                "action_items": [],
                "status": "fallback",
            }

    except Exception as e:
        error_message = str(e)

        # Handle rate limits / quota exceeded
        if "429" in error_message or "RESOURCE_EXHAUSTED" in error_message:
            return {
                "transcript": transcript,
                "summary": "Gemini quota exceeded. Please try again later.",
                "action_items": [],
                "status": "rate_limited",
            }

        # Handle temporary API unavailability
        elif "503" in error_message or "UNAVAILABLE" in error_message:
            return {
                "transcript": transcript,
                "summary": "Gemini service is temporarily unavailable.",
                "action_items": [],
                "status": "service_unavailable",
            }

        # Handle authentication/API key errors
        elif "401" in error_message or "403" in error_message:
            return {
                "transcript": transcript,
                "summary": "Invalid or missing Gemini API key.",
                "action_items": [],
                "status": "authentication_error",
            }

        # Generic API/network error fallback
        else:
            return {
                "transcript": transcript,
                "summary": f"AI processing failed: {error_message}",
                "action_items": [],
                "status": "error",
            }