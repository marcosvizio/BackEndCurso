import cartModel from "../models/cart.js";
import mongoose from "mongoose";

export default class CartManager {

    getCarts = (params) => {
        return cartModel.find(params).lean().populate('products.product')
    }

    getCartBy = (params) => {
        return cartModel.findOne(params).lean().populate('products.product')
    }

    createCart = (cart) => {
        return cartModel.create(cart)
    }

    addProductToCart = async (cid, pid) => {
        const cart = await this.getCartBy({_id:cid})
        const isInCart = cart.products.find((prod) => prod.product._id.toString() === pid)
        if (!isInCart) {
            return cartModel.updateOne({_id:cid}, {$push: {products:{product: new mongoose.Types.ObjectId(pid)}}})
        }
        return cartModel.updateOne({_id:cid, products: {product: {_id: pid}}}, {$inc: {"products.$.quantity": 1}}) 
    }

    deleteCart=(cid)=>{
        return cartModel.findByIdAndDelete(cid)
    }

}