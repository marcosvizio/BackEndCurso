const deleteFromCart = document.querySelectorAll('#deleteProduct')

deleteFromCart.forEach(element => {
    element.addEventListener('click', event => {
        event.preventDefault();
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Product removed from cart!',
        })
    })
});