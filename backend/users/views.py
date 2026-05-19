from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from .serializers import RegisterSeriliazer
from .permissions import IsAdmin

class LoginView(APIView):
    permission_classes =[AllowAny]

    def post(self,request):
        username= request.data.get('username')
        password= request.data.get('password')

        user = authenticate(username=username,password=password)
        if not user:
            return Response({'error': 'Invalid credentials'}, status=401)
        
        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role

        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id':       user.id,
                'username': user.username,
                'role':     user.role,
            }
        },status=200)

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
        serializer = RegisterSeriliazer(
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


