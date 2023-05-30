import mongoose from "mongoose";

const collection = 'Carts';

const schema = new mongoose.Schema({
    products: {
        type: [{
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref:'Products'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }]
    }
}, {timestamps: {createdAt: 'created_at', updated_at: 'updated_at'}
});

const cartModel = mongoose.model(collection, schema);

export default cartModel;