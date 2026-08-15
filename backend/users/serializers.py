from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User


class POSTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims so the frontend knows the role without an extra API call
        token['role']     = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            'id':       self.user.id,
            'username': self.user.username,
            'email':    self.user.email,
            'role':     self.user.role,
        }

        return data


class RegisterSerializer(serializers.ModelSerializer):
    email    = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)
    role     = serializers.ChoiceField(
        choices=User.ROLES,
        default='visitor',
        required=False,
    )

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'role']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use.")
        return value

    def validate_role(self, value):
        """
        Only authenticated admins may assign elevated roles (cashier / admin).
        Anyone else attempting to pass role='cashier' or role='admin' gets a
        ValidationError, so the public register endpoint cannot be exploited
        by simply passing an elevated role in the payload.
        """
        request = self.context.get('request')
        if value != 'visitor':
            is_admin = (
                request and
                request.user.is_authenticated and
                request.user.role == 'admin'
            )
            if not is_admin:
                raise serializers.ValidationError(
                    "Only admins can assign the 'cashier' or 'admin' role."
                )
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        role     = validated_data.pop('role', 'visitor')

        user = User(**validated_data, role=role)
        user.set_password(password)
        user.save()
        return user