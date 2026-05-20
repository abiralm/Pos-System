from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User

class POSTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims 
        token['role'] = user.role
        token['username'] = user.username
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'role': self.user.role
        }

        return data



class RegisterSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length = True)

    class Meta:
        model= User
        fields = ['username','email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value

    def validate_role(self,value):
        request = self.context.get('request')

        if value== 'admin':
            if not request.user.is_authenticated or request.user.role !='admin':
                raise serializers.ValidationError('Only admins create admins')
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User(username= validated_data['username'],role='visitor')
        user.set_password(password)
        user.save()

        return user

