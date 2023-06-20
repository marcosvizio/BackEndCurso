import cartModel from "../models/cart.js";
import mongoose from "mongoose";

export default class CartManager {

    getCarts = (params) => {
        return cartModel.find(params).lean()
    }

    getCartBy = (params) => {
        return cartModel.findOne(params).lean()
    }

    getCartByIdAndUpdate = async (cid) => {
        return cartModel.updateOne({_id: cid}, {$set: {products: []}})
    }

    createCart = (cart) => {
        return cartModel.create(cart)
    }

    addProductToCart = async (cid, pid, quantity) => {
        const cart = await this.getCartBy({_id:cid})
        const prodToAdd = cart.products.find((prod) => prod.product._id == pid)
        if (prodToAdd) {
            const updateProd = prodToAdd.quantity + quantity;
            prodToAdd.quantity = updateProd
            const updateCart = cartModel.updateOne({_id: cid}, cart)
            return updateCart
        }else{
            return cartModel.findByIdAndUpdate(cid, 
                {$push: {products: {product: new mongoose.Types.ObjectId(pid), quantity: quantity}}})
        }      
    }

    deleteProductToCart = async (cid, pid) => {
        const cart = await this.getCartBy({_id:cid})
        const products = cart.products;
        const ids = products.map(prod => prod.product._id)
        const productToDelete = ids.findIndex((id)=> id == pid);
        if (productToDelete === -1) {
            return null
        }else{
            return await cartModel.updateOne({_id:cid}, {$pull: {products: {product: pid}}})
        }
    }

    deleteCart=(cid)=>{
        return cartModel.updateOne({_id: cid}, {$set: {products: []}})
    }

}