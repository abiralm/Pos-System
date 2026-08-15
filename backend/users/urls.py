from django.urls import path
from .views import (
LoginView, LogoutView, RegisterView,
    PasswordResetRequestView, PasswordResetConfirmView
)
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]