from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import serializers
from .models import User

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

class RegisterSeriliazer(serializers.ModelSerializer):
    class Meta:
        model= User
        fields = ['username', 'password', 'role']

    def validate_role(self,value):
        request = self.context.get('request')

        if value== 'admin':
            if not request.user.is_authenticated:
                raise serializers.ValidationError('Only admins create admins')
            
            if request.user.role !='admin':
                raise serializers.ValidationError('Only admins create admins')
        
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user

