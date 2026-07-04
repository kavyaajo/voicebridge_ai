from .models import AudioRecord, AIResult


def search_meetings(keyword):
    results = AIResult.objects.filter(
        summary__icontains=keyword
    )

    meetings = []

    for item in results:
        meetings.append({
            "id": item.audio.id,
            "summary": item.summary
        })

    return meetings