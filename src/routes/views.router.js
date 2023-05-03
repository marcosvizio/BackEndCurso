import { Router } from 'express'
import ProductManager from '../../productManager.js';

const router = Router();
const productManager = new ProductManager('./products.json')

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const limit = req.query.limit
        if (!limit) {
            res.status(200).render('home',{
                status: 'success',
                css: 'home',
                products: products
            })
        } else if (isNaN(limit)) {
            res.status(400).send({
                status: 'failure',
                message: "The query params 'limit' is not a number!"
            })
        } else {
            const parseLimit = parseInt(limit)
            if (parseLimit > products.length) {
                res.status(200).render('home',{
                    status: 'success',
                    css: 'home',
                    products: products
                })
            } else {
                res.status(200).render('home',{
                    status: 'success',
                    css: 'home',
                    products: products.slice(0, parseLimit)
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/realtimeproducts', (_req, res) => {
    try {
        res.status(200).render('realTimeProducts', {
            status: 'success',
            css: 'realTimeProducts'
        })
    } catch (err) {
        console.log(err);
    }
})

export default router;