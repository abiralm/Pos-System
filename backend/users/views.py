from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import POSTokenObtainPairSerializer, RegisterSerializer
from .permissions import IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView


class LoginView(TokenObtainPairView):
    serializer_class = POSTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'},status=200)
        except Exception:
            return Response({'error': 'Invalid token'}, status=400)

class RegisterView(APIView):
    def get_permissions(self):
        # Public registration allowed for POST
        if self.request.method == 'POST':
            return [AllowAny()]

        return super().get_permissions()
    def post(self,request):
        serializer = RegisterSerializer(
            data = request.data,
            context = {'request':request}
        )

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                'message':'User sucessfully created',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role
                }
            }, status=201)
        
        return Response(serializer.errors, status=400)


