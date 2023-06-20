import { Router } from 'express'
import ProductManager from '../dao/mongoDb/manager/Products.js'
import productModel from '../dao/mongoDb/models/product.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req,res) => {
    try {
        const { page:queryPage, limit:queryLimit, category, sort:querySort } = req.query

        const defaultLimit = 5
        const limit = queryLimit ? parseInt(queryLimit) : defaultLimit

        const defaultPage = 1
        const page = queryPage ? parseInt(queryPage) : defaultPage

        const defaultSort = 1
        const sort = querySort ? parseInt(querySort) : defaultSort

        if (category) {
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({category: category}, {page, limit, lean:true, sort: {price:sort}})
            const productsFilter = docs

            if (hasPrevPage === false && hasNextPage === false) {
                const prevLink = null;
                const nextLink = null;
                res.status(200).send({
                    status: 'success',
                    payload: productsFilter,
                    totalPages,
                    prevPage,
                    nextPage,
                    page: rest.page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink,
                    nextLink
                })
            } else if (hasPrevPage === false) {
                const prevLink = null;
                const nextLink = `localhost:8080/api/products/?page=${nextPage}&category=${category}`
                res.status(200).send({
                    status: 'success',
                    payload: productsFilter,
                    totalPages,
                    prevPage,
                    nextPage,
                    page: rest.page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink,
                    nextLink
                })
            } else if (hasNextPage === false){
                const prevLink = `localhost:8080/api/products/?page=${prevPage}&category=${category}`;
                const nextLink = null;
                res.status(200).send({
                    status: 'success',
                    payload: productsFilter,
                    totalPages,
                    prevPage,
                    nextPage,
                    page: rest.page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink,
                    nextLink
                })
            }
        }else{
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, ...rest } = await productModel.paginate({},{page, limit, lean:true, sort: {price:sort}});
            const products = docs

            if (hasPrevPage === false && hasNextPage === false) {
                const prevLink = null;
                const nextLink = null
                res.status(200).send({
                    status: 'success',
                    payload: products,
                    totalPages,
                    prevPage,
                    nextPage,
                    page: rest.page,
                    hasPrevPage,
                    hasNextPage,
                    nextLink,
                    prevLink
                })
            } else if (hasPrevPage === false) {
                const prevLink = null;
                const nextLink = `localhost:8080/api/products/?page=${nextPage}`;
                res.status(200).send({
                    status: 'success',
                    payload: products,
                    totalPages,
                    prevPage,
                    nextPage,
                    page: rest.page,
                    hasPrevPage,
                    hasNextPage,
                    nextLink,
                    prevLink
                })
            }else if (hasNextPage === false){
                const nextLink = null
                const prevLink = `localhost:8080/api/products/?page=${prevPage}`
                res.status(200).send({
                    status: 'success',
                    payload: products,
                    totalPages,
                    prevPage,
                    nextPage,
                    page: rest.page,
                    hasPrevPage,
                    hasNextPage,
                    nextLink,
                    prevLink
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
        const product = await productManager.getProductBy({_id: pid})
        if ( !product ) {
            res.status(404).send({
                status: 'failure',
                message: 'The product not exist to found!'
            })
        } else {
            res.status(200).send({
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
        if ( !product ) {
            res.status(400).send({
                status: 'failure',
                message: 'The product is not added! Look the code or data.'
            })
        } else {
            const products = await productManager.getProducts()
            req.io.emit('products', products)
            res.status(200).send({
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
        await productManager.updateProduct({_id: pid}, product)
        res.status(200).send({
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
        const product = await productManager.deleteProduct({_id: pid})
        if (!product) {
            res.status(404).send({
                status: 'failure',
                message: 'The product not exist to delete!'
            })
        } else {
            const products = await productManager.getProducts();
            req.io.emit('products', products)
            res.status(200).send({
                status: 'success',
                message: 'Product deleted!'
            })
        }
    } catch (err) {
        console.log(err);
    }
})

export default router;
