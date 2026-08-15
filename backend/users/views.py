from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import POSTokenObtainPairSerializer, RegisterSerializer
from .permissions import IsAdmin
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from .models import User


class LoginThrottle(AnonRateThrottle):
    scope = 'login'


class LoginView(TokenObtainPairView):
    serializer_class = POSTokenObtainPairSerializer
    throttle_classes = [LoginThrottle]


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


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        try:
            user  = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid   = urlsafe_base64_encode(force_bytes(user.pk))
            link  = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"
            send_mail(
                subject='POS — Password Reset Request',
                message=f'Reset your password here (expires in 1 hour):\n{link}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            pass  # Never reveal whether an email exists
        return Response(
            {'message': 'If that email is registered, a reset link has been sent.'},
            status=200
        )


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid      = request.data.get('uid', '')
        token    = request.data.get('token', '')
        password = request.data.get('password', '')

        if not all([uid, token, password]):
            return Response({'error': 'uid, token, and password are required.'}, status=400)

        try:
            pk   = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=pk)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Invalid reset link.'}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'Reset link expired or already used.'}, status=400)

        if len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'}, status=400)

        user.set_password(password)
        user.save()
        return Response({'message': 'Password reset successful. Please log in.'}, status=200)


