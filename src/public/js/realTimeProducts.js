const socket = io();

socket.on('products', data => {
    const listProducts = document.getElementById("listProducts");
    let content = "";
    data.forEach(prod => {
        content += `
        <li>
            <p>Product: ${prod.title}</p>
            <p>Description: ${prod.description}</p>
            <p>Price: ${prod.price}</p>
            <p>Thumbnails: ${prod.thumbnails}</p>
            <p>Stock: ${prod.stock}</p>
        </li>`
    listProducts.innerHTML = content;
    })
})