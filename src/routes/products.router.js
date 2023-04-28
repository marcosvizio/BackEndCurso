import { Router } from 'express'
import ProductManager from '../../productManager.js'

const router = Router();
const productManager = new ProductManager('./products.json')

router.get('/', async (req,res) => {
    try {
        const products = await productManager.getProducts()
        const limit = req.query.limit
        if (!limit) {
            res.status(200).json({
                status: 'success',
                products: products
            })
        } else if (isNaN(limit)) {
            res.status(400).json({
                status: 'failure',
                message: "The query params 'limit' is not a number!"
            })
        } else {
            const parseLimit = parseInt(limit)
            if (parseLimit > products.length) {
                res.status(200).json({
                    status: 'success',
                    products: products
                })
            } else {
                res.status(200).json({
                    status: 'success',
                    products: products.slice(0, parseLimit)
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const id = parseInt(pid)
        const product = await productManager.getProductById(id)
        if ( product == null ) {
            res.status(400).json({
                status: 'failure',
                message: 'The product not exist to found!'
            })
        } else {
            res.status(200).json({
                status: 'success',
                product: product
            })
        }
    } catch (err) {
        console.log(err);
    }
})

router.post('/', async (req, res) => {
    try {
        const newProduct = req.body
        const product = await productManager.addProduct(newProduct)
        if ( product == null ) {
            res.status(400).json({
                status: 'failure',
                message: 'The product is not added! Look the code or data.'
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'Product added!',
            })
        }   
    } catch (err) {
        console.log(err);
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const product = req.body
        const { pid } = req.params
        const id = parseInt(pid);
        await productManager.updateProduct(id, product)
        res.status(200).json({
            status: 'success',
            message:'Product updated successfully!'
        })
    } catch (err) {
        console.log(err);
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const id = parseInt(pid)
        const product = await productManager.deleteProduct(id)
        if (product == null) {
            res.status(400).json({
                status: 'failure',
                message: 'The product not exist to delete!'
            })
        } else {
            res.status(200).json({
                status: 'success',
                message: 'Product deleted!'
            })
        }
    } catch (err) {
        console.log(err);
    }
})

export default router;
