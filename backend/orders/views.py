from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status

from cart.cart import Cart
from .serializers import CheckoutSerializer
from .services import create_order_from_cart

class CheckoutView(APIView):
    def post(self,request):
        cart = Cart(request)

        if len(cart)==0:
            return Response({
                'message':'Cart is empty',
            },status=status.HTTP_400_BAD_REQUEST)
        
        serializer = CheckoutSerializer(data= request.data)
        serializer.is_valid(raise_exception=True)

        order = create_order_from_cart(cart,serializer.validated_data['customer_name'],serializer.validated_data['email'])
        cart.clear_cart()

        return Response({
            "message": "Order created successfully",
            "order_id": order.id,
            "total": order.get_grand_total()
        },status=status.HTTP_200_OK)

