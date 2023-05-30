import mongoose from "mongoose";

const collection = 'Products';

const schema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    code:{
        type: String,
        unique: true
    },
    category: String,
    status: {
        type: Boolean,
        default: true
    },
    stock: Number,
    id: String
},{timestamps:{createdAt:'created_at',updatedAt:'updated_at'}})

const productsModel = mongoose.model(collection, schema)

export default productsModel