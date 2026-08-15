from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Only users with role='admin' are allowed."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsCashier(BasePermission):
    """Only users with role='cashier' are allowed."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'cashier'


class IsAdminOrCashier(BasePermission):
    """Admins and cashiers are allowed — visitors are blocked."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ('admin', 'cashier')
        )