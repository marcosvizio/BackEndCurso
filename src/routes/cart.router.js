import { Router } from 'express';
import CartManager from '../dao/mongoDb/manager/Carts.js';

const router = Router();
const cartServices = new CartManager();

router.get('/', async (req, res) => {
    try {
        const carts = await cartServices.getCarts();
        if (!carts) {
            res.status(404).send({status: 'error', error: 'Not found carts!'})
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
            res.status(404).send({status: 'error', error: 'Cart not created'})
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
            res.status(400).send({
                status: 'failure',
                message: 'The cart not exist!'
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
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartServices.addProductToCart(cid, pid);
        if (!cart) {
            res.status(404).send({status: 'error', error: 'Cart not found'})
        }
        res.status(200).send({status: 'success', payload:cart})
    }catch(err){
        console.log(err)
    }
})

export default router;
