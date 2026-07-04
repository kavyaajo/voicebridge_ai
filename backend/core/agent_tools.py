from django.db.models import Q
from .models import AIResult


def search_meetings(keyword: str) -> list:
    """
    Search previous meetings using a keyword.

    Args:
        keyword: Word or phrase to search.

    Returns:
        List of matching meetings.
    """

    meetings = AIResult.objects.filter(
        Q(summary__icontains=keyword)
        | Q(action_items__icontains=keyword)
        | Q(important_names_dates__icontains=keyword)
        | Q(audio__transcript__icontains=keyword)
    )

    results = []

    for meeting in meetings:
        results.append({
            "id": meeting.audio.id,
            "filename": meeting.audio.audio_file.name.split("/")[-1],
            "summary": meeting.summary,
            "action_items": meeting.action_items,
            "important_names_dates": meeting.important_names_dates,
            "created_at": meeting.created_at.strftime("%d %b %Y"),
        })

    return results


def generate_followup_email(summary: str) -> str:
    """
    Generate a professional follow-up email.

    Args:
        summary: Meeting summary.

    Returns:
        Email text.
    """

    return f"""
Subject: Follow-up on Today's Meeting

Hi Team,

Thank you for attending today's meeting.

Meeting Summary

{summary}

Please review the action items and let me know if anything was missed.

Best regards,
VoiceBridge AI
""".strip()