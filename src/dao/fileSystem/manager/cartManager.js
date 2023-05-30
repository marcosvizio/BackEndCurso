import fs from "fs"

export default class CartManager {
    constructor(path){
        this.path = path
    }

    getCarts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path,'utf-8')
            const carts = JSON.parse(data)
            return carts;
        }
        return [];
    };

    getCartById = async (id) => {

        const carts = await this.getCarts();

        const cartIndex = carts.findIndex(cart => cart.id === id)

        if (cartIndex === -1) {
            return null
        }

        const cart = carts[cartIndex]
        return cart
    }

    createCart = async () => {
        const carts = await this.getCarts();
    
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
        const carts = await this.getCarts();
        const cart = await this.getCartById(cid)
        const cartIndex = await this.getCartById(cid)
        const productIndex = cart.products.findIndex(prod => prod.id === product.id);

        if (productIndex === -1) {
            const productIdQuantity = {
              id: product.id,
              quantity: 1,
            };
            cart.products.push(productIdQuantity)
        } else {
            for (let i = 0; i < cart.products.length; i++) {
                if (cart.products[i].id === product.id) {
                    cart.products[i].quantity += 1;
                }    
            }
        }
    
        carts.splice(cartIndex, 1, cart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    }
}

