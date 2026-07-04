from django.db.models import Q
from .models import AIResult


def search_meetings(keyword):
    """
    Search previous meetings by keyword.
    Searches summary, transcript, action items and important names.
    """

    meetings = AIResult.objects.filter(
        Q(summary__icontains=keyword) |
        Q(action_items__icontains=keyword) |
        Q(important_names_dates__icontains=keyword) |
        Q(audio__transcript__icontains=keyword)
    )

    results = []

    for meeting in meetings:
        results.append({
            "id": meeting.audio.id,
            "file_name": meeting.audio.audio_file.name.split("/")[-1],
            "summary": meeting.summary,
            "action_items": meeting.action_items,
            "important_names_dates": meeting.important_names_dates,
            "created_at": meeting.created_at.strftime("%d %b %Y"),
        })

    return results


def generate_followup_email(summary):
    """
    Generate a professional follow-up email.
    """

    return f"""Subject: Follow-up on Today's Meeting

Hi Team,

Thank you for attending today's meeting.

Here is a quick summary:

{summary}

Please review the discussed points and complete your assigned action items.

Feel free to reach out if anything needs clarification.

Best regards,
VoiceBridge AI
"""