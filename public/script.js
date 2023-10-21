document.addEventListener('DOMContentLoaded', () => {
  const addToCartButtons = document.querySelectorAll('.buy-link');
  const cartCount = document.getElementById('cart-count');
        module.exports = CartItem;
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', addToCart);
  });

  function addToCart(event) {
    const productCard = event.target.closest('.product-card');
    const productId = productCard.getAttribute('data-product-id');

    addToCartOnServer(productId, (response) => {
      if (response.success) {
        updateCartCount();
        alert('Produsul a fost adăugat în coș.');
      } else {
        alert('Eroare la adăugarea produsului în coș.');
      }
    });
  }

  function addToCartOnServer(productId, callback) {
    setTimeout(() => {
      const response = { success: true };
      callback(response);
    }, 1000); 
  }

  function updateCartCount() {
    setTimeout(() => {
      const itemCount = 3;
      cartCount.textContent = itemCount;
    }, 1000); 
  }
});
