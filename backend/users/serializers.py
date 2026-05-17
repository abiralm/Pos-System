from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class POSTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims — readable without a DB hit
        token['role'] = user.role
        token['username'] = user.username
        return token

class POSTokenObtainPairView(TokenObtainPairView):
    serializer_class = POSTokenObtainPairSerializer
