from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import PaymentSerializer
from .models import Payment
from orders.models import Order

class PaymentView(APIView):
    def post(self,request):
        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order_id = serializer.validated_data['order_id']
        method = serializer.validated_data['method']

        order = Order.objects.get(id=order_id)
        if order.status == 'paid':
            return Response({"error": "Already paid"}, status=400)
        
        payment = Payment.objects.create(
            order = order,
            method = method,
            amount = order.get_grand_total(),
            status = 'completed'
        )
        payment.save()

        order.status = 'paid'
        order.save()

        return Response({
            "message": "Payment successful",
            "payment_id": payment.id
        },status=status.HTTP_200_OK)