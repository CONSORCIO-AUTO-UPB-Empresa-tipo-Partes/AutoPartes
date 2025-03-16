// CarritoModel.js

export function updateQuantity(button, change) {
    let item = button.closest('.cart-item');
    let quantityElement = item.querySelector('.quantity');
    let availableElement = item.querySelector('.available');
    let price = parseInt(item.getAttribute('data-price'));
    let quantity = parseInt(quantityElement.textContent);
    let available = parseInt(availableElement.textContent);

    if (change > 0 && available > 0) {
        quantity++;
        available--;
    } else if (change < 0 && quantity > 1) {
        quantity--;
        available++;
    }

    quantityElement.textContent = quantity;
    availableElement.textContent = available;
    updateTotal();
}

export function removeFromCart(button) {
    button.closest('.cart-item').remove();
    updateTotal();
}

export function updateTotal() {
    let total = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        let quantity = parseInt(item.querySelector('.quantity').textContent);
        let price = parseInt(item.getAttribute('data-price'));
        total += quantity * price;
    });
    document.getElementById('total-price').textContent = total > 0 ? `$${total.toLocaleString()}` : '$0';
}
