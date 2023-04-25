import fs from "fs";

export default class ProductManager {
    constructor(path) {
        this.path = path
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path,'utf-8')
            const products = JSON.parse(data)
            return products;
        }
        return [];
    };

    addProduct = async ({title,description,code,price,status,stock,category,thumbnail = []}) => {

        const products = await this.getProducts();

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            category,
            status,
            stock,
        };
    
        const validation = Object.values(product);
        const empty = validation.some((empty) => empty === undefined);
        if (empty) {
            console.log("Faltan ingresar datos!");
            return null;
        }

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

        const productIndex = products.findIndex(prod => prod.id === id)

        if (productIndex === -1) {
            console.log('Product not found!');
        }

        const product = products[productIndex]
        return product
    }

    updateProduct = async (id, updatedFields) => {

        const products = await this.getProducts();

        const productIndex = products.findIndex(prod => prod.id === id)

        const productToUpdate = { ...products[productIndex], ...updatedFields }

        products[productIndex] = productToUpdate

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))

        return productToUpdate;
    }

    deleteProduct = async (...productIds) => {
        const products = await this.getProducts();

        for (const id of productIds) {
            const productIndex = products.findIndex((product) => product.id === id);
            products.splice(productIndex, 1);
            await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
        }    
    }

    /* METODOS PARA EL CARRITO */

    createCart = async () => {
        const carts = await this.getProducts();

        const cart = {
            id: null,
            products: []
        }

        if (carts.length === 0) {
            cart.id = 1
        } else {
            const lastCart = carts[carts.length - 1]
            cart.id = lastCart.id + 1
        }

        carts.push(cart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    }

    addProductToCart = async (cid,product) => {
        const carts = await this.getProducts();
        const cartUploaded = await this.getProductById(cid)
        const cartIndex = await this.getProductById(cid);
        const productIndex = cartUploaded.products.findIndex(prod => prod.id === product.id);

        if (productIndex === -1) {
            const productIdQuantity = {
              id: product.id,
              quantity: 1,
            };
            cartUploaded.products.push(productIdQuantity)
        } else {
            for (let i = 0; i < cartUploaded.products.length; i++) {
                if (cartUploaded.products[i].id === product.id) {
                    cartUploaded.products[i].quantity += 1;
                }    
            }
        }

        carts.splice(cartIndex, 1, cartUploaded);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    }


}