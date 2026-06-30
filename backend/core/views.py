from rest_framework.decorators import APIView, api_view, action
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import AudioRecord, User,AIResult
from .serializers import UserSerializer, AudioRecordSerializer
from .supabase_client import supabase

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from .ai_service import generate_summary,transcribe_audio
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
import tempfile 
import traceback


"""Registers a new user using username and email."""
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response(
            {"error": "Username, email and password are required."},
            status=400,
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )

    return Response(
        {
            "message": "User registered successfully.",
            "user_id": user.id,
        },
        status=201,
    )
    
"""Authenticates a user using their email address."""
@api_view(['POST'])
def login(request):
    email = request.data.get('email')

    if not email:
        return Response(
            {'error': 'Email is required.'},
            status=400
        )

    try:
        user = User.objects.get(email=email)

        return Response(
            {
                'message': 'Login successful.',
                'user_id': user.id,
                'username': user.username
            },
            status=200
        )

    except User.DoesNotExist:
        return Response(
            {
                'error': 'User with this email does not exist. Please register first.'
            },
            status=404
        )

"""Provides CRUD operations for uploading and managing audio records."""
class AudioRecordViewSet(viewsets.ModelViewSet):
    queryset = AudioRecord.objects.select_related("user").all()
    serializer_class = AudioRecordSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user']

    def perform_create(self, serializer):
        audio_file = self.request.FILES.get("audio_file")
        transcript = ""

        try:
            if audio_file:
                supabase.storage.from_("audio-files").upload(
                    audio_file.name,
                    audio_file.read()
                )

                audio_file.seek(0)

                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
                    for chunk in audio_file.chunks():
                        temp.write(chunk)
                    temp_path = temp.name

                transcript = transcribe_audio(temp_path)

            serializer.save(
                user=self.request.user,
                audio_file=audio_file,
                transcript=transcript
            )

        except Exception as e:
            import traceback
            print(traceback.format_exc())
            raise

    @action(detail=True, methods=["get"])
    def get_audio_file(self, request, pk=None):
        record = self.get_object()

        file_name = record.audio_file.name.split("/")[-1]

        download_url = supabase.storage.from_("audio-files").get_public_url(file_name)

        return Response({
            "download_url": download_url
        })


class AISummaryView(APIView):
    """Generates AI-powered summaries and action items from transcripts."""
    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def post(self, request):
        transcript = request.data.get("transcript", "")
        audio_id = request.data.get("audio_id")  # optional
        print("Audio ID:",audio_id)
        

        if not transcript:
            return Response(
                {"error": "Transcript is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Generate AI summary
            result = generate_summary(transcript)

            # Save AI output if audio_id is provided
            if audio_id:
                try:
                    audio_record = AudioRecord.objects.get(id=audio_id)

                    AIResult.objects.update_or_create(
                        audio=audio_record,
                        defaults={
                            "summary": result.get("summary", ""),
                            "key_points": "\n".join(
                                result.get("action_items", [])
                            ),
                            "translation": ""
                        }
                    )

                except AudioRecord.DoesNotExist:
                    return Response(
                        {"error": "AudioRecord not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )

            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    