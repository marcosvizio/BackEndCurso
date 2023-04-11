import fs from "fs";

class ProductManager {
    constructor() {
        this.path = "./products.json"
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path,'utf-8')
            const products = JSON.parse(data)
            return products;
        }
        return [];
    };

    addProduct = async (product) => {

        const products = await this.getProducts();

        if (products.length === 0) {
            product.id = 1
        } else {
            product.id = products[products.length - 1].id + 1;
        }

        const productCode = products.find(prod => prod.code === product.code)

        if (productCode) {
            console.log("Error: El CODE del producto ingresado ya es utilizado en otro producto.");
            return null;
        }

        products.push(product)

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));

    }

    getProductById = async (id) => {

        const products = await this.getProducts();

        const productId = products.find(product => product.id === id)

        if (productId) {
            console.log(productId);
            return productId;
        }else{
            console.log("Product not found!");
        }

    }

    updateProduct = async (id,title,description,price,thumbnail,code,stock) => {

        const products = await this.getProducts();

        const productIndex = products.findIndex(product => product.id === id)

        const productToUpdate = products[productIndex]
        productToUpdate.title = title
        productToUpdate.description = description
        productToUpdate.price = price
        productToUpdate.thumbnail = thumbnail
        productToUpdate.code = code
        productToUpdate.stock = stock

        products.splice(productIndex, 1, productToUpdate)

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
    }

    deleteProduct = async (...productIds) => {
        const products = await this.getProducts();

        for (const id of productIds) {
            const productIndex = products.findIndex((product) => product.id === id);
            products.splice(productIndex, 1);
            await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
        }    
    }
}

const productManager = new ProductManager;

/* await productManager.getProducts(); */

/* await productManager.updateProduct(1, 'Saco', 'Saco negro con detalles en blanco', 8500, 'saco.png', 45520, 8); */

/* await productManager.deleteProduct() */

const product1 = {
    title: "Remera",
    description: "Remera estampada roja",
    price: 2500,
    thumbnail: "remera.jpg",
    code: 226,
    stock: 10
}

const product2 = {
    title: "Pantalon",
    description: "Pantalon de jean negro",
    price: 5500,
    thumbnail: "pantalon.jpg",
    code: 25587,
    stock: 5
}

const product3 = {
    title: "Campera",
    description: "Campera impermeable verde militar",
    price: 8000,
    thumbnail: "campera.jpg",
    code: 58664,
    stock: 10
}

/* await productManager.addProduct(product1)
await productManager.addProduct(product2)
await productManager.addProduct(product3) */