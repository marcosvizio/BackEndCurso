import express from 'express';
import ProductManager from '../productManager.js'

const app = express();

const productManager = new ProductManager('./products.json')

app.get('/products', async (req,res) => {
    try {
        const products = await productManager.getProducts()
        const limit = req.query.limit
        const parseLimit = parseInt(limit)
        if (!limit || parseLimit > products.length) {
            res.status(200).products
        } else {
            res.send(products.slice(0, parseLimit))
        }
    } catch (err) {
        console.log(err);
    }
})

app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const id = parseInt(pid)
        const productId = await productManager.getProductById(id)
        res.status(200).json(
            productId
        )
    } catch (err) {
        console.log(err);
    }
})

app.listen(8080,() => console.log('Server running on port 8080'));