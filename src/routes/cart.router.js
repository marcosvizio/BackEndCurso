import { Router } from 'express';
import ProductManager from '../../productManager.js';
import CartManager from '../../cartManager.js';

const router = Router();
const cartManager = new CartManager('./cart.json')
const productManager = new ProductManager('./products.json')

router.post('/', async (_req,res) => {
    try {
        const cart = await cartManager.createCart()
        res.status(200).json({
            status: 'success',
            message: 'Cart created!'
        })
    } catch (err) {
        console.log(err);
    }  
})

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const id = parseInt(cid)
        const cartSelected = await cartManager.getCartById(id)
        if (cartSelected == null) {
            res.status(400).json({
                status: 'failure',
                message: 'The cart not exist!'
            })
        } else {
            res.status(200).json({
                status: 'success',
                CartSelected: cartSelected
            })
        }
        
    } catch (err) {
        console.log(err);
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid } = req.params
        const { pid } = req.params
        const cidParsed = parseInt(cid)
        const pidParsed = parseInt(pid)
        const product = await productManager.getProductById(pidParsed)
        if (product == null) {
            res.status(400).json({
                status: 'failure',
                message: 'The product not exist to add in the cart!'
            })
        } else {
            await cartManager.addProductToCart(cidParsed,product);
            res.status(200).json({
                status: 'success',
                message: 'Product added to cart!'
            })
        }
    } catch (err) {
        console.log(err);
    }
})

export default router;
