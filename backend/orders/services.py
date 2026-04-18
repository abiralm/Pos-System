from .models import  Order, OrderItem

def create_order_from_cart(cart,customer_name,email):
    order = Order.objects.create(
        customer_name =  customer_name,
        email= email,
        tax=0,
        discount =0
    )

    for item in cart:
        OrderItem.objects.create(
            order=order,
            product = item['product'],
            price = item['price'],
            quantity=item['quantity']
        )
    
    return order