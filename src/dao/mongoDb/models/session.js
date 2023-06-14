import mongoose, { mongo } from "mongoose";

const collection = 'Sessions';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "user"
    }
}, {timestamps: {createdAt: 'created_at', updated_at: 'updated_at'}}
)

const sessionModel = mongoose.model(collection, schema);

export default sessionModel;