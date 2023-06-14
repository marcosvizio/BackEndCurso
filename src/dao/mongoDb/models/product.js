import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'Products';

const schema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: [],
    code: String,
    category: String,
    status: {
        type: String,
        default: true
    },
    stock: Number
}, {timestamps: {createdAt: 'created_at', updated_at: 'updated_at'}}
);

schema.plugin(mongoosePaginate)

const productModel = mongoose.model(collection, schema);

export default productModel;