from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AudioRecord, User
from .serializers import UserSerializer, AudioRecordSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')

    if not username or not email:
        return Response(
            {'error': 'Username and email are required.'},
            status=400
        )

    user = User.objects.create(
        username=username,
        email=email
    )

    return Response(
        {
            'message': 'User registered successfully.',
            'user_id': user.id
        },
        status=201
    )


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
            {'error': 'User with this email does not exist. Please register first.'},
            status=404
        )
    
class AudioRecordViewSet(viewsets.ModelViewSet):
    queryset = AudioRecord.objects.all()
    serializer_class = AudioRecordSerializer
    permission_classes = [IsAuthenticated] 
    