import { Router } from 'express';
import CartManager from '../dao/mongoDb/manager/Carts.js';

const router = Router();
const cartServices = new CartManager();

router.get('/', async (_req, res) => {
    try {
        const carts = await cartServices.getCarts();
        if (!carts) {
            res.status(404).send({status: 'error', error: 'Not found carts'})
        }
        res.status(200).send({status: 'success', payload: carts})
    } catch (error) {
        console.log(error);
    }
})

router.post('/', async (req,res) => {
    try {
        const { cart } = req.body
        const newCart = await cartServices.createCart(cart)
        if (!newCart) {
            res.status(400).send({status: 'error', error: 'Cart not created'})
        }
        res.status(200).send({
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
        const cartSelected = await cartServices.getCartBy({_id: cid})
        if (!cartSelected) {
            res.status(404).send({
                status: 'failure',
                message: 'The cart not found'
            })
        } else {
            res.status(200).send({
                status: 'success',
                CartSelected: cartSelected
            })
        }
        
    } catch (err) {
        console.log(err);
    }
})

router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params
        const cartSelected = await cartServices.getCartByIdAndUpdate(cid)
        if (!cartSelected) {
            res.status(404).send({status: 'error', error:'Cart not found to update'})
        } else {
            res.status(200).send({status: 'success', payload: cartSelected})
        }
    } catch (error) {
        console.log(error);
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartDelete = await cartServices.deleteCart({_id: cid})
        if (!cartDelete) {
            res.status(404).send({status: 'error', error: 'Cart not found to delete'})
        }
        res.status(200).send({status: 'success', message: 'Cart deleted'})
    } catch (error) {
        console.log(error);
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    try{
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartServices.addProductToCart(cid, pid, quantity);
        if (!cart) {
            res.status(404).send({status: 'error', error: 'Cart not found'})
        } else {
            res.status(200).send({status: 'success', payload:cart})
        }
    }catch(err){
        console.log(err)
    }
})

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const prodDeleted = await cartServices.deleteProductToCart(cid, pid)
        if (!prodDeleted) {
            res.status(404).send({status: 'error', error: 'Product not found to delete'})
        } else {
            res.status(200).send({status: 'success', message: 'Product deleted'})
        }
    } catch (error) {
        console.log(error);
    }
})

export default router;
