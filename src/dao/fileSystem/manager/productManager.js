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

    addProduct = async ({title,description,code,price,status,stock,category,thumbnails = []}) => {

        const products = await this.getProducts();

        const product = {
            title,
            description,
            price,
            thumbnails,
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
            console.log("Code identico entre productos!");
            return null;
        }

        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
        return product
    }

    getProductById = async (id) => {

        const products = await this.getProducts();

        const productIndex = products.findIndex(prod => prod.id === id)

        if (productIndex === -1) {
            return null
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

    deleteProduct = async (id) => {
        const products = await this.getProducts();

        const productIndex = products.findIndex((prod) => prod.id === id);
        
        if (productIndex === -1 ) {
            return null
        }

        products.splice(productIndex, 1);

        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
        return productIndex
    }

}