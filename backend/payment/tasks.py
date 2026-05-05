from io import BytesIO

from celery import shared_task
from orders.models import Order
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from config import settings



#task to send pdf by email when order is completed
@shared_task
def notify_payment(order_id):
    order = Order.objects.get(id=order_id)

    html = render_to_string('orders/order/pdf.html', {
        'order': order
    })

    pdf_buffer = BytesIO()
    pisa_status = pisa.CreatePDF(html, dest=pdf_buffer)

    if pisa_status.err:
        return f"PDF generation failed for order {order_id}"

    email = EmailMessage(
    subject= f"Invoice for Order :{order_id}",
    body=f"Please find the invoice of your order: Order {order_id}",
    from_email=settings.EMAIL_HOST_USER,
    to=[order.email]
    )

    email.attach(f'order_{order.id}.pdf', pdf_buffer.getvalue(), 'application/pdf')

    email.send()
