search_meetings_declaration = {
    "type": "function",
    "name": "search_meetings",
    "description": "Search previous meetings by keyword.",
    "parameters": {
        "type": "object",
        "properties": {
            "keyword": {
                "type": "string",
                "description": "Keyword to search for in previous meetings."
            }
        },
        "required": ["keyword"]
    }
}


generate_followup_email_declaration = {
    "type": "function",
    "name": "generate_followup_email",
    "description": "Generate a professional follow-up email from a meeting summary.",
    "parameters": {
        "type": "object",
        "properties": {
            "summary": {
                "type": "string",
                "description": "Meeting summary."
            }
        },
        "required": ["summary"]
    }
}