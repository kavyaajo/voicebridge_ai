import json
import os

from google import genai

from .agent_tools import(
 search_meetings, generate_followup_email,
 ) 

from .function_declarations import (
    search_meetings_declaration,
    generate_followup_email_declaration,
)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

TOOLS = [
   search_meetings,
    generate_followup_email,
]

def run_agent(query):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=query,
        config={
            "tools": TOOLS,
        },
    )

    # If Gemini didn't call any function
    if not response.function_calls:
        return response.text

    function_call = response.function_calls[0]

    # Execute the requested function
    if function_call.name == "search_meetings":
        result = search_meetings(**function_call.args)

    elif function_call.name == "generate_followup_email":
        result = generate_followup_email(**function_call.args)

    else:
        result = {"error": "Unknown function"}

    # Send the function result back to Gemini
    final_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            response.candidates[0].content,
            genai.types.Content(
                role="user",
                parts=[
                    genai.types.Part.from_function_response(
                        name=function_call.name,
                        response={"result": result},
                    )
                ],
            ),
        ],
        config={
            "tools": TOOLS,
        },
    )

    return final_response.text 

    