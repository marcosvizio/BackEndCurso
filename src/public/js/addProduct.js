const addToCart = document.querySelectorAll('#addToCart')

addToCart.forEach(element => {
    element.addEventListener('click', event => {
        event.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Product added in the cart!',
        })
    })
});