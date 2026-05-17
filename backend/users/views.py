from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate


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
        })