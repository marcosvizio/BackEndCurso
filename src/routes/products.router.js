import { Router } from 'express'
import ProductManager from '../../productManager.js'

const router = Router();
const productManager = new ProductManager('./products.json')

router.get('/', async (req,res) => {
    try {
        const products = await productManager.getProducts()
        const limit = req.query.limit
        const parseLimit = parseInt(limit)
        if (!limit || parseLimit > products.length) {
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
    } catch (err) {
        console.log(err);
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const id = parseInt(pid)
        const productId = await productManager.getProductById(id)
        res.status(200).json({
            status: 'success',
            ProductId: productId
        })
    } catch (err) {
        console.log(err);
    }
})

router.post('/', async (req, res) => {
    try {
        const product = req.body
        await productManager.addProduct(product)
        res.status(200).json({
            status: 'success',
            message: 'Product added',
        })
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
            message:'Product updated successfully'
        })
    } catch (err) {
        console.log(err);
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const id = parseInt(pid)
        await productManager.deleteProduct(id)
        res.status(200).json({
            status: 'success',
            message: 'Product deleted'
        })
    } catch (err) {
        console.log(err);
    }
})

export default router;
