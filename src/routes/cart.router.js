import { Router } from 'express';
import ProductManager from '../../productManager.js';

const router = Router();
const cartManager = new ProductManager('./cart.json')
const productManager = new ProductManager('./products.json')

router.post('/', async (_req,res) => {
    try {
        const cart = await cartManager.createCart()
            res.status(200).json({
            ok: true,
            cart: cart
        })
    } catch (err) {
        console.log(err);
    }  
})

router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const id = parseInt(cid)
        const cartSelected = await cartManager.getProductById(id)
        res.status(200).json({
            ok: true,
            CartSelected: cartSelected
        })
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
        const addProductToCart = await cartManager.addProductToCart(cidParsed,product);
        res.status(200).json({
            ok: true,
            addProduct: addProductToCart
        })
    } catch (err) {
        console.log(err);
    }
})

export default router;
