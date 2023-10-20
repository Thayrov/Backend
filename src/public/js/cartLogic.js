document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.add-to-cart-button');

  addToCartButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      alert('Product added to cart!');
      const form = event.target.closest('form');
      if (form) {
        form.submit();
      } else {
        console.error('Form not found. Cannot submit.');
      }
    });
  });

  const updateButtons = document.querySelectorAll('.update-quantity-button');

  updateButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      const form = event.target.closest('.update-form');
      const formData = new FormData(form);
      const quantity = formData.get('quantity');
      const actionUrl = form.action;

      fetch(actionUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({quantity}),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Product quantity updated successfully') {
            window.location.reload();
          }
        })
        .catch(error => console.error('Error updating quantity:', error));
    });
  });

  const removeButtons = document.querySelectorAll('.remove-product-button');

  removeButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      const productId = event.target.getAttribute('data-product-id');
      const cartId = event.target.getAttribute('data-cart-id');
      const actionUrl = `/api/carts/${cartId}/products/${productId}`;

      // Confirm with the user before removing
      if (window.confirm('Are you sure you want to remove this product from the cart?')) {
        fetch(actionUrl, {
          method: 'DELETE',
        })
          .then(response => response.json())
          .then(data => {
            if (data.message === 'Product deleted from cart successfully') {
              window.location.reload();
            }
          })
          .catch(error => console.error('Error removing product:', error));
      }
    });
  });

  const clearCartButton = document.querySelector('.clear-cart-button');

  clearCartButton?.addEventListener('click', function (event) {
    const cartId = event.target.getAttribute('data-cart-id');
    const actionUrl = `/api/carts/${cartId}`;

    // Confirm with the user before clearing the cart
    if (window.confirm('Are you sure you want to clear the entire cart?')) {
      fetch(actionUrl, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Cart cleared successfully') {
            window.location.reload();
          }
        })
        .catch(error => console.error('Error clearing cart:', error));
    }
  });

  const buyButton = document.querySelector('.buy-button');
  buyButton?.addEventListener('click', function (event) {
    const cartId = event.target.getAttribute('data-cart-id');
    const actionUrl = `/api/carts/${cartId}/purchase`;

    // Confirm with the user before finalizing the purchase
    if (window.confirm('Are you sure you want to buy these items?')) {
      fetch(actionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Purchase finalized successfully') {
            alert(`Purchase successful! Your ticket info: ${JSON.stringify(data.ticket)}`);
          } else if (
            data.message === 'Some products could not be processed due to insufficient stock.'
          ) {
            alert(
              `Some items could not be purchased due to insufficient stock. Unprocessed items: ${data.unprocessedProducts}`,
            );
          }
        })
        .catch(error => console.error('Error finalizing purchase:', error));
    }
  });
});
