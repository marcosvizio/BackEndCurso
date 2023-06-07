import { Router } from 'express'
import productModel from '../dao/mongoDb/models/product.js';
import CartManager from '../dao/mongoDb/manager/Carts.js';

const cartServices = new CartManager();
const router = Router();

router.get('/products', async (req, res) => {
    try {
        const { page:queryPage, limit:queryLimit, category, sort:querySort } = req.query

        const defaultLimit = 5
        const limit = queryLimit ? parseInt(queryLimit) : defaultLimit

        const defaultPage = 1
        const page = queryPage ? parseInt(queryPage) : defaultPage

        const defaultSort = 1
        const sort = querySort ? parseInt(querySort) : defaultSort

        if (category) {
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await productModel.paginate({category: category}, {page, limit, lean:true, sort: {price:sort}})
            const productsFilter = docs
            res.status(200).render('home', {
                status: 'success',
                css: 'home',
                products: productsFilter,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page:rest.page
            })
        }else{
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } = await productModel.paginate({},{page, limit, lean:true});
            const products = docs
            res.status(200).render('home',{
                status: 'success',
                css: 'home',
                products: products,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page:rest.page
            })
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

router.get('/chat', (_req,res) => {
    try {
        res.status(200).render('chat', {
            status: 'success',
            css: 'chat'
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/cart/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const cartSelected = await cartServices.getCartBy({_id: cid})
        const products = cartSelected.products
        if (!cartSelected) {
            res.status.send({status: 'failure', error: 'Cart not found'})
        }
        res.status(200).render('cart',{
            status: 'success',
            css: 'cart',
            products: products
        })
    } catch (error) {
        console.log(error);
    }
})

export default router;