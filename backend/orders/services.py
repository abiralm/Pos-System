from .models import  Order, OrderItem

def create_order_from_cart(cart,customer_name,email):
    order = Order.objects.create(
        customer_name =  customer_name,
        email= email,
        tax=0,
        discount =0
    )

    for item in cart:

        product = item['product']
        quantity=item['quantity']

        if quantity>product.stock:
            raise ValueError(f"Not enough stock for {product.name}")
        
        product.stock -= quantity
        product.save()

        OrderItem.objects.create(
            order=order,
            product = product,
            price = product.price, #price = item['price'],
            quantity= quantity,
            product_name=item['product'].name 
        )
    
    return order